const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  tech: [{ type: String }],
  link: { type: String, required: true },
  image: { type: String }, // path to the uploaded image
  revenue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
