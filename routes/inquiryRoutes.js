const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { apiKeyMiddleware } = require('../middleware/auth');

router.post('/', inquiryController.createInquiry);
router.get('/', apiKeyMiddleware, inquiryController.getInquiries);
router.patch('/:id', apiKeyMiddleware, inquiryController.updateInquiryStatus);
router.delete('/:id', apiKeyMiddleware, inquiryController.deleteInquiry);

module.exports = router;
