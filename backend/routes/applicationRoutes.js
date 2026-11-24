const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student endpoints
router.post('/apply/:jobId', protect, authorize('student'), applyForJob);
router.get('/my', protect, authorize('student'), getMyApplications);

// Recruiter endpoints
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterApplications);

// Admin endpoints
router.get('/', protect, authorize('admin'), getAllApplications);

// Status update (Recruiter or Admin)
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
