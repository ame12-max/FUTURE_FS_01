const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with storage (for multiple files)
const upload = multer({ storage });

const router = express.Router();

// Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authMiddleware, upload.array('images', 10), createProject);   // <-- multiple images
router.put('/:id', authMiddleware, upload.array('images', 10), updateProject); // <-- multiple images
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;