const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');
const User = require('../models/User');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/analytics/admin
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const unplacedStudents = await Student.countDocuments({ placementStatus: 'Unplaced' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const upcomingDrives = await PlacementDrive.countDocuments({ status: 'Upcoming' });

    // Placement rate percentage
    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // Highest and average salary
    const salaryStats = await Student.aggregate([
      { $match: { placementStatus: 'Placed', placedPackageLPA: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          highestPackage: { $max: '$placedPackageLPA' },
          avgPackage: { $avg: '$placedPackageLPA' },
        },
      },
    ]);

    // Applications by status
    const applicationStatusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Department-wise student counts
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('job', 'title')
      .populate('company', 'name')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        placedStudents,
        unplacedStudents,
        placementRate,
        totalCompanies,
        totalJobs,
        activeJobs,
        totalApplications,
        upcomingDrives,
        highestPackage: salaryStats[0]?.highestPackage || 0,
        averagePackage: salaryStats[0]?.avgPackage ? Math.round(salaryStats[0].avgPackage * 10) / 10 : 0,
        applicationStatusCounts,
        departmentStats,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Recruiter
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter)
exports.getRecruiterAnalytics = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(200).json({
        success: true,
        data: {
          totalJobs: 0,
          activeJobs: 0,
          totalApplicants: 0,
          shortlisted: 0,
          selected: 0,
          rejected: 0,
        },
      });
    }

    const totalJobs = await Job.countDocuments({ company: company._id });
    const activeJobs = await Job.countDocuments({ company: company._id, status: 'Active' });
    const totalApplicants = await Application.countDocuments({ company: company._id });
    const shortlisted = await Application.countDocuments({ company: company._id, status: 'Shortlisted' });
    const interviewing = await Application.countDocuments({ company: company._id, status: 'Interviewing' });
    const selected = await Application.countDocuments({ company: company._id, status: 'Selected' });
    const rejected = await Application.countDocuments({ company: company._id, status: 'Rejected' });

    res.status(200).json({
      success: true,
      data: {
        companyName: company.name,
        totalJobs,
        activeJobs,
        totalApplicants,
        shortlisted,
        interviewing,
        selected,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Student
// @route   GET /api/analytics/student
// @access  Private (Student)
exports.getStudentAnalytics = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const totalAvailableJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments({ student: student._id });
    const shortlistedCount = await Application.countDocuments({ student: student._id, status: 'Shortlisted' });
    const interviewingCount = await Application.countDocuments({ student: student._id, status: 'Interviewing' });
    const selectedCount = await Application.countDocuments({ student: student._id, status: 'Selected' });
    const upcomingDrives = await PlacementDrive.countDocuments({ status: 'Upcoming' });

    res.status(200).json({
      success: true,
      data: {
        placementStatus: student.placementStatus,
        placedPackageLPA: student.placedPackageLPA || 0,
        totalAvailableJobs,
        totalApplications,
        shortlistedCount,
        interviewingCount,
        selectedCount,
        upcomingDrives,
      },
    });
  } catch (error) {
    next(error);
  }
};
