const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public / Private
exports.getCompanies = async (req, res, next) => {
  try {
    const { search, industry, location } = req.query;
    let query = {};

    if (industry) query.industry = new RegExp(industry, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { industry: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
      ];
    }

    const companies = await Company.find(query)
      .populate('recruiter', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiter', 'name email phone');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id, status: 'Active' });

    res.status(200).json({
      success: true,
      data: company,
      activeJobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's own company profile
// @route   GET /api/companies/my/profile
// @access  Private (Recruiter)
exports.getMyCompanyProfile = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      // Auto-initialize company profile for recruiter if missing
      company = await Company.create({
        name: `${req.user.name}'s Tech Corp`,
        recruiter: req.user._id,
        industry: 'Information Technology',
        location: 'Bangalore, India',
        contactEmail: req.user.email,
        contactPhone: req.user.phone || '',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (Admin, Recruiter)
exports.createCompany = async (req, res, next) => {
  try {
    const { name, industry, location, website, description, logoUrl, contactEmail, contactPhone } = req.body;

    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({ success: false, message: 'A company with this name already exists' });
    }

    const company = await Company.create({
      name,
      recruiter: req.user.role === 'recruiter' ? req.user._id : (req.body.recruiterId || req.user._id),
      industry: industry || 'Information Technology',
      location: location || 'Bangalore, India',
      website: website || '',
      description: description || '',
      logoUrl: logoUrl || '',
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
    });

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Admin, Recruiter owner)
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Recruiter can only edit their own company
    if (req.user.role === 'recruiter' && company.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this company profile' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: company,
      message: 'Company profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin)
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Delete associated jobs as well
    await Job.deleteMany({ company: req.params.id });
    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company and associated jobs deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
