const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects',      // folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authMiddleware, upload.array('images', 10), createProject);
router.put('/:id', authMiddleware, upload.array('images', 10), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
