const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { apiKeyMiddleware } = require('../middleware/auth');

router.post('/', bookingController.createBooking);
router.get('/', apiKeyMiddleware, bookingController.getBookings);
router.patch('/:id', apiKeyMiddleware, bookingController.updateBooking);
router.delete('/:id', apiKeyMiddleware, bookingController.deleteBooking);

module.exports = router;
