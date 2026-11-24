const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getRecruiterAnalytics,
  getStudentAnalytics,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminAnalytics);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterAnalytics);
router.get('/student', protect, authorize('student'), getStudentAnalytics);

module.exports = router;
