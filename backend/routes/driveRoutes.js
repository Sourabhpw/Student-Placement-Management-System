const express = require('express');
const router = express.Router();
const {
  getDrives,
  createDrive,
  updateDrive,
  deleteDrive,
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDrives);
router.post('/', protect, authorize('admin', 'recruiter'), createDrive);
router.put('/:id', protect, authorize('admin'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);

module.exports = router;
