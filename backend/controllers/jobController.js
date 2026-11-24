const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Student = require('../models/Student');

// @desc    Get all jobs (public/student/recruiter/admin with filters)
// @route   GET /api/jobs
// @access  Public / Private
exports.getJobs = async (req, res, next) => {
  try {
    const { search, roleCategory, location, minPackage, maxPackage, status } = req.query;
    let query = {};

    // By default, if not admin/recruiter, return active jobs
    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }

    if (roleCategory) query.roleCategory = roleCategory;
    if (location) query.location = new RegExp(location, 'i');
    if (minPackage || maxPackage) {
      query.packageLPA = {};
      if (minPackage) query.packageLPA.$gte = Number(minPackage);
      if (maxPackage) query.packageLPA.$lte = Number(maxPackage);
    }

    let jobs = await Job.find(query)
      .populate('company', 'name industry location logoUrl website')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          (j.company && j.company.name.toLowerCase().includes(s)) ||
          j.location.toLowerCase().includes(s) ||
          j.requiredSkills.some((sk) => sk.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public / Private
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name industry location website description logoUrl contactEmail')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Check application status if user is a student
    let userApplication = null;
    let isEligible = true;
    let eligibilityReasons = [];

    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) {
        userApplication = await Application.findOne({
          job: job._id,
          student: student._id,
        });

        // Evaluate eligibility
        if (student.academicDetails.graduationCgpa < job.eligibility.minCgpa) {
          isEligible = false;
          eligibilityReasons.push(`Requires minimum CGPA of ${job.eligibility.minCgpa} (Your CGPA: ${student.academicDetails.graduationCgpa})`);
        }
        if (student.academicDetails.activeBacklogs > job.eligibility.maxBacklogs) {
          isEligible = false;
          eligibilityReasons.push(`Maximum allowed active backlogs is ${job.eligibility.maxBacklogs} (You have: ${student.academicDetails.activeBacklogs})`);
        }
        if (job.eligibility.allowedBranches && job.eligibility.allowedBranches.length > 0) {
          if (!job.eligibility.allowedBranches.includes(student.course) && !job.eligibility.allowedBranches.includes(student.department)) {
            isEligible = false;
            eligibilityReasons.push(`Allowed courses: ${job.eligibility.allowedBranches.join(', ')}`);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: job,
      userApplication,
      eligibilityCheck: {
        isEligible,
        reasons: eligibilityReasons,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/recruiter/my
// @access  Private (Recruiter)
exports.getMyPostedJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const jobs = await Job.find({ company: company._id })
      .populate('company', 'name industry')
      .sort({ createdAt: -1 });

    // Attach application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter, Admin)
exports.createJob = async (req, res, next) => {
  try {
    let companyId = req.body.company;

    if (req.user.role === 'recruiter') {
      const company = await Company.findOne({ recruiter: req.user._id });
      if (!company) {
        return res.status(400).json({ success: false, message: 'Please create/complete your company profile first' });
      }
      companyId = company._id;
    }

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'Company ID is required' });
    }

    const jobData = {
      ...req.body,
      company: companyId,
      postedBy: req.user._id,
      requiredSkills: Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : (req.body.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job opening posted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter owner, Admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this job' });
    }

    if (req.body.requiredSkills && !Array.isArray(req.body.requiredSkills)) {
      req.body.requiredSkills = req.body.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
      message: 'Job posting updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter owner, Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job posting and related applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
