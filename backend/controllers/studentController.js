const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students (with search, filter, pagination)
// @route   GET /api/students
// @access  Private (Admin, Recruiter)
exports.getStudents = async (req, res, next) => {
  try {
    const { search, department, course, batchYear, placementStatus, minCgpa } = req.query;
    let query = {};

    if (department) query.department = department;
    if (course) query.course = course;
    if (batchYear) query.batchYear = Number(batchYear);
    if (placementStatus) query.placementStatus = placementStatus;
    if (minCgpa) {
      query['academicDetails.graduationCgpa'] = { $gte: parseFloat(minCgpa) };
    }

    let students = await Student.find(query)
      .populate('user', 'name email phone isActive')
      .populate('placedCompany', 'name')
      .sort({ createdAt: -1 });

    // Client search filter if provided
    if (search) {
      const s = search.toLowerCase();
      students = students.filter(
        (st) =>
          st.rollNumber.toLowerCase().includes(s) ||
          (st.user && st.user.name.toLowerCase().includes(s)) ||
          (st.user && st.user.email.toLowerCase().includes(s)) ||
          st.skills.some((sk) => sk.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's own profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('placedCompany', 'name industry website');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, Recruiter)
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email phone isActive')
      .populate('placedCompany', 'name industry');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateMyProfile = async (req, res, next) => {
  try {
    let student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const {
      rollNumber,
      department,
      course,
      batchYear,
      gender,
      dob,
      academicDetails,
      skills,
      certifications,
      linkedinUrl,
      githubUrl,
      name,
      phone,
    } = req.body;

    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    student.rollNumber = rollNumber || student.rollNumber;
    student.department = department || student.department;
    student.course = course || student.course;
    student.batchYear = batchYear || student.batchYear;
    student.gender = gender || student.gender;
    if (dob) student.dob = dob;
    if (academicDetails) {
      student.academicDetails = {
        ...student.academicDetails,
        ...academicDetails,
      };
    }
    if (skills) {
      student.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());
    }
    if (certifications) student.certifications = certifications;
    if (linkedinUrl !== undefined) student.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) student.githubUrl = githubUrl;

    await student.save();

    const updated = await Student.findOne({ user: req.user._id }).populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Student profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload student resume
// @route   POST /api/students/resume
// @access  Private (Student)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or document file' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    student.resumeUrl = fileUrl;
    student.resumeOriginalName = req.file.originalname;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: fileUrl,
      resumeOriginalName: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create student with user account
// @route   POST /api/students
// @access  Private (Admin)
exports.createStudentByAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, rollNumber, department, course, batchYear, academicDetails, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Student@123', salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      phone: phone || '',
    });

    const student = await Student.create({
      user: user._id,
      rollNumber: rollNumber || `MCA-${Date.now().toString().slice(-4)}`,
      department: department || 'Computer Applications',
      course: course || 'MCA',
      batchYear: batchYear || new Date().getFullYear(),
      academicDetails: academicDetails || {
        tenthPercentage: 75,
        twelfthPercentage: 75,
        graduationCgpa: 7.5,
      },
      skills: skills || ['C++', 'Java', 'SQL'],
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update student details & placement status
// @route   PUT /api/students/:id
// @access  Private (Admin)
exports.updateStudentByAdmin = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const {
      name,
      phone,
      rollNumber,
      department,
      course,
      batchYear,
      placementStatus,
      placedCompany,
      placedPackageLPA,
      academicDetails,
      skills,
    } = req.body;

    if (name || phone) {
      await User.findByIdAndUpdate(student.user, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    if (rollNumber) student.rollNumber = rollNumber;
    if (department) student.department = department;
    if (course) student.course = course;
    if (batchYear) student.batchYear = batchYear;
    if (placementStatus) student.placementStatus = placementStatus;
    if (placedCompany !== undefined) student.placedCompany = placedCompany || null;
    if (placedPackageLPA !== undefined) student.placedPackageLPA = placedPackageLPA;
    if (academicDetails) student.academicDetails = academicDetails;
    if (skills) student.skills = skills;

    await student.save();

    res.status(200).json({
      success: true,
      data: student,
      message: 'Student updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student and associated account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
