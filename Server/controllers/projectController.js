const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  // Example URL: https://res.cloudinary.com/.../upload/v123456/portfolio_projects/filename.jpg
  const parts = url.split('/');
  const filename = parts.pop().split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
};

// Get all projects (with images)
exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    for (let project of projects) {
      const [images] = await db.query('SELECT * FROM project_images WHERE project_id = ? ORDER BY display_order', [project.id]);
      project.images = images;
    }
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get single project (with images)
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) return res.status(404).json({ message: 'Project not found' });
    const project = projects[0];
    const [images] = await db.query('SELECT * FROM project_images WHERE project_id = ? ORDER BY display_order', [id]);
    project.images = images;
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create project with multiple images (Cloudinary)
exports.createProject = async (req, res) => {
  const { title, description, full_description, live_url, github_url, technologies, features, category, tags, imageTitles } = req.body;
  const imageFiles = req.files || []; // Cloudinary file objects (each has .path or .secure_url)
  try {
    const [result] = await db.query(
      `INSERT INTO projects (title, description, full_description, live_url, github_url, technologies, features, category, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, full_description, live_url, github_url, technologies, features, category, tags]
    );
    const projectId = result.insertId;
    const titles = imageTitles ? JSON.parse(imageTitles) : [];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageUrl = imageFiles[i].path; // Cloudinary returns the secure URL in .path (or .secure_url)
      const title = titles[i] || '';
      await db.query('INSERT INTO project_images (project_id, image_url, title, display_order) VALUES (?, ?, ?, ?)', 
        [projectId, imageUrl, title, i]);
    }
    res.status(201).json({ message: 'Project created', id: projectId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update project (replace images) – Cloudinary
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, full_description, live_url, github_url, technologies, features, category, tags, imageTitles, deleteImages } = req.body;
  const newImageFiles = req.files || [];
  try {
    // Update project details
    await db.query(
      `UPDATE projects SET title=?, description=?, full_description=?, live_url=?, github_url=?, technologies=?, features=?, category=?, tags=? WHERE id=?`,
      [title, description, full_description, live_url, github_url, technologies, features, category, tags, id]
    );
    // Handle deleted images (remove from Cloudinary and DB)
    if (deleteImages) {
      const toDelete = JSON.parse(deleteImages);
      for (let imageId of toDelete) {
        const [rows] = await db.query('SELECT image_url FROM project_images WHERE id = ?', [imageId]);
        if (rows.length) {
          const publicId = getPublicIdFromUrl(rows[0].image_url);
          await cloudinary.uploader.destroy(publicId); // delete from Cloudinary
          await db.query('DELETE FROM project_images WHERE id = ?', [imageId]);
        }
      }
    }
    // Add new images
    const titles = imageTitles ? JSON.parse(imageTitles) : [];
    for (let i = 0; i < newImageFiles.length; i++) {
      const imageUrl = newImageFiles[i].path;
      const title = titles[i] || '';
      await db.query('INSERT INTO project_images (project_id, image_url, title, display_order) VALUES (?, ?, ?, ?)', 
        [id, imageUrl, title, 999]);
    }
    res.json({ message: 'Project updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete project (cascade deletes images from Cloudinary & DB)
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const [images] = await db.query('SELECT image_url FROM project_images WHERE project_id = ?', [id]);
    // Delete each image from Cloudinary
    for (let img of images) {
      const publicId = getPublicIdFromUrl(img.image_url);
      await cloudinary.uploader.destroy(publicId);
    }
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
