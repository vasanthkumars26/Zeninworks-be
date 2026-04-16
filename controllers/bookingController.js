const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { gmeetLink, status } = req.body;
    
    // update status to 'Replied' if gmeetLink is provided and no specific status is set
    const updateData = { ...req.body };
    if (gmeetLink && (!status || status === 'Pending' || status === 'New')) {
      updateData.status = 'Replied';
    }

    const updated = await Booking.findByIdAndUpdate(id, updateData, { new: true });
    
    if (gmeetLink && updated.email) {
      const nodemailer = require('nodemailer');
      // Set up a mock or real transporter
      // For a real professional setup, we rely on env vars
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER || 'test@gmail.com', pass: process.env.EMAIL_PASS || 'pass' }
      });
      
      try {
        await transporter.sendMail({
          from: '"Zeninworks Admin" <noreply@zeninworks.com>',
          to: updated.email,
          subject: 'Your Discovery Call - Google Meet Link',
          text: `Hello ${updated.name},\n\nYour discovery call has been scheduled. Here is your Google Meet link: ${gmeetLink}\n\nLooking forward to speaking with you!\n\nBest,\nZeninworks Team`,
          html: `<p>Hello ${updated.name},</p><p>Your discovery call has been scheduled.</p><p>Here is your Google Meet link: <a href="${gmeetLink}">${gmeetLink}</a></p><p>Looking forward to speaking with you!</p><p>Best,<br/>Zeninworks Team</p>`
        });
        console.log('Email sent successfully to', updated.email);
      } catch (emailErr) {
        console.error('Error sending email:', emailErr);
        // Continue anyway so we don't fail the update request if email fails
      }
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
