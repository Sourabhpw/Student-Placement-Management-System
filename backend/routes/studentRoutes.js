const express = require('express');
const router = express.Router();
const {
  getStudents,
  getMyProfile,
  getStudentById,
  updateMyProfile,
  uploadResume,
  createStudentByAdmin,
  updateStudentByAdmin,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadResume: upload } = require('../middleware/uploadMiddleware');

// Student specific routes
router.get('/profile', protect, authorize('student'), getMyProfile);
router.put('/profile', protect, authorize('student'), updateMyProfile);
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

// Admin & Recruiter routes
router.get('/', protect, authorize('admin', 'recruiter'), getStudents);
router.get('/:id', protect, authorize('admin', 'recruiter'), getStudentById);

// Admin only CRUD
router.post('/', protect, authorize('admin'), createStudentByAdmin);
router.put('/:id', protect, authorize('admin'), updateStudentByAdmin);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
