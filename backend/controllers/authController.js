const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// @desc    Register new user (Student / Recruiter / Admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, rollNumber, department, course, batchYear, companyName, industry, location } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Prevent public registration as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is restricted. Admin accounts can only be created by system administrators.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (only student or recruiter allowed via public registration)
    const userRole = role === 'recruiter' ? 'recruiter' : 'student';
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone: phone || '',
    });

    // Create student or company profile depending on role
    if (userRole === 'student') {
      await Student.create({
        user: user._id,
        rollNumber: rollNumber || `ROLL-${Date.now().toString().slice(-6)}`,
        department: department || 'Computer Applications',
        course: course || 'MCA',
        batchYear: batchYear || new Date().getFullYear(),
        academicDetails: {
          tenthPercentage: req.body.tenthPercentage || 70,
          twelfthPercentage: req.body.twelfthPercentage || 70,
          graduationCgpa: req.body.graduationCgpa || 7.5,
          activeBacklogs: 0,
          historyOfBacklogs: 0,
        },
        skills: req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim())) : ['JavaScript', 'Node.js', 'React'],
      });
    } else if (userRole === 'recruiter') {
      await Company.create({
        name: companyName || `${name}'s Organization`,
        recruiter: user._id,
        industry: industry || 'Information Technology',
        location: location || 'Bangalore, India',
        contactEmail: email,
        contactPhone: phone || '',
        description: req.body.description || 'Technology Solutions Provider',
        website: req.body.website || 'https://example.com',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact administrator.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Fetch related profile if student or recruiter
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await Company.findOne({ recruiter: user._id });
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      profile: profileData,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile & details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id }).populate('placedCompany', 'name');
    } else if (user.role === 'recruiter') {
      profile = await Company.findOne({ recruiter: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile basics
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
      message: 'User details updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
