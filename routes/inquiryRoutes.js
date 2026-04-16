const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

router.post('/', inquiryController.createInquiry);
router.get('/', inquiryController.getInquiries);
router.patch('/:id', inquiryController.updateInquiryStatus);
router.delete('/:id', inquiryController.deleteInquiry);

module.exports = router;
