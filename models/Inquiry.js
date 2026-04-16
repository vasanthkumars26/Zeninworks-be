const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectType: { type: String, required: true },
  budget: { type: String, required: true },
  deadline: { type: String },
  requirements: { type: String, required: true },
  status: { type: String, enum: ['New', 'Reviewed', 'Contacted'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
