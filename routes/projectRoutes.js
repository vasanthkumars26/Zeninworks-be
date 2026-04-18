const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const { apiKeyMiddleware } = require('../middleware/auth');

// Multer configured
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit for text fields (like base64 image)
});

router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', apiKeyMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }
    // ensure tech is handled if it comes as a JSON string when using form-data
    if (typeof projectData.tech === 'string') {
      try {
        const parsedTech = JSON.parse(projectData.tech);
        if (Array.isArray(parsedTech)) {
          projectData.tech = parsedTech;
        }
      } catch (e) {
        // if not valid json, just use it as string, or we already handle it in AdminDashboard before parsing?
        // Wait, FormData will send it as string. We should just parse if it's string.
        projectData.tech = projectData.tech.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    const newProject = new Project(projectData);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', apiKeyMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', apiKeyMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }
    if (typeof projectData.tech === 'string') {
      try {
        const parsedTech = JSON.parse(projectData.tech);
        if (Array.isArray(parsedTech)) {
          projectData.tech = parsedTech;
        }
      } catch (e) {
        projectData.tech = projectData.tech.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
