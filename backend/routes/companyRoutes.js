const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  getMyCompanyProfile,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCompanies);
router.get('/my/profile', protect, authorize('recruiter'), getMyCompanyProfile);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('admin', 'recruiter'), createCompany);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateCompany);
router.delete('/:id', protect, authorize('admin'), deleteCompany);

module.exports = router;
