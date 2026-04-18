const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

exports.createInquiry = async (req, res) => {
  try {
    const { name, email, mobile, projectType, budget, deadline, requirements } = req.body;
    
    const newInquiry = new Inquiry({
      name, email, mobile, projectType, budget, deadline, requirements
    });

    await newInquiry.save();

    // Nodemailer setup (Assuming real env vars are set for production)
    // For now we just log, or standard structure
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: '"Zeninworks" <noreply@zeninworks.com>',
      to: email,
      subject: 'Inquiry Received - Zeninworks',
      text: 'Thank you for reaching out! We will review your requirements and get back to you.'
    });
    */

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Server error creating inquiry' });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
    
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    
    res.status(200).json({ message: 'Status updated', inquiry: updated });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating inquiry' });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Inquiry not found' });
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting inquiry' });
  }
};
