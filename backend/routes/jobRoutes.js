const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getMyPostedJobs,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/recruiter/my', protect, authorize('recruiter'), getMyPostedJobs);
// Note: Optional auth for job details (to show eligibility if student)
router.get('/:id', (req, res, next) => {
  // If authorization header exists, authenticate, else continue as guest
  if (req.headers.authorization) {
    protect(req, res, next);
  } else {
    next();
  }
}, getJobById);

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
