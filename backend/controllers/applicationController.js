const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Company = require('../models/Company');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
exports.applyForJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found. Please complete profile.' });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'This job posting is no longer active' });
    }

    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      student: student._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position',
      });
    }

    // Check academic eligibility
    if (student.academicDetails.graduationCgpa < job.eligibility.minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Eligibility criteria not met: Required CGPA ${job.eligibility.minCgpa}, your CGPA is ${student.academicDetails.graduationCgpa}`,
      });
    }

    const application = await Application.create({
      job: jobId,
      student: student._id,
      company: job.company._id,
      resumeUrl: student.resumeUrl || '',
      coverLetter: req.body.coverLetter || '',
      statusHistory: [
        {
          status: 'Applied',
          comment: 'Application submitted successfully',
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own applications
// @route   GET /api/applications/my
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        select: 'title location packageLPA roleCategory deadline status',
        populate: {
          path: 'company',
          select: 'name logoUrl location industry',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for recruiter's jobs or specific job
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter)
exports.getRecruiterApplications = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    let query = { company: company._id };
    if (req.query.jobId) {
      query.job = req.query.jobId;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title location packageLPA')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.jobId) query.job = req.query.jobId;

    const applications = await Application.find(query)
      .populate('job', 'title location packageLPA')
      .populate('company', 'name')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Recruiter/Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter, Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const allowedStatuses = ['Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('student');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (notes) application.recruiterNotes = notes;

    application.statusHistory.push({
      status,
      comment: notes || `Status updated to ${status}`,
      updatedAt: new Date(),
    });

    await application.save();

    // If selected, update student placement status
    if (status === 'Selected') {
      await Student.findByIdAndUpdate(application.student._id, {
        placementStatus: 'Placed',
        placedCompany: application.company,
        placedPackageLPA: application.job.packageLPA,
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};
