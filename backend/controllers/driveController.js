const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');

// @desc    Get all placement drives
// @route   GET /api/drives
// @access  Public / Private
exports.getDrives = async (req, res, next) => {
  try {
    const { status, driveType } = req.query;
    let query = {};
    if (status) query.status = status;
    if (driveType) query.driveType = driveType;

    const drives = await PlacementDrive.find(query)
      .populate('company', 'name industry location logoUrl website')
      .populate('createdBy', 'name email')
      .sort({ driveDate: 1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      data: drives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new placement drive
// @route   POST /api/drives
// @access  Private (Admin, Recruiter)
exports.createDrive = async (req, res, next) => {
  try {
    const { title, company, driveDate, venue, driveType, description, eligibleCourses } = req.body;

    const drive = await PlacementDrive.create({
      title,
      company,
      driveDate,
      venue,
      driveType: driveType || 'On-Campus',
      description: description || '',
      eligibleCourses: eligibleCourses || ['MCA', 'B.Tech CS', 'BCA'],
      createdBy: req.user._id,
    });

    const populatedDrive = await PlacementDrive.findById(drive._id).populate('company', 'name industry');

    res.status(201).json({
      success: true,
      data: populatedDrive,
      message: 'Placement drive scheduled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement drive
// @route   PUT /api/drives/:id
// @access  Private (Admin)
exports.updateDrive = async (req, res, next) => {
  try {
    let drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('company', 'name industry');

    res.status(200).json({
      success: true,
      data: drive,
      message: 'Placement drive updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete placement drive
// @route   DELETE /api/drives/:id
// @access  Private (Admin)
exports.deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    await PlacementDrive.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Placement drive deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
