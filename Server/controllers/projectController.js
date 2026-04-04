const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper to delete image files
const deleteImageFile = (imageUrl) => {
  const filePath = path.join(__dirname, '..', imageUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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

// Create project with multiple images
exports.createProject = async (req, res) => {
  const { title, description, full_description, live_url, github_url, technologies, features, category, tags, imageTitles } = req.body;
  const imageFiles = req.files || []; // array of uploaded files
  try {
    const [result] = await db.query(
      `INSERT INTO projects (title, description, full_description, live_url, github_url, technologies, features, category, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, full_description, live_url, github_url, technologies, features, category, tags]
    );
    const projectId = result.insertId;
    // Insert images
    const titles = imageTitles ? JSON.parse(imageTitles) : [];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageUrl = `/uploads/${imageFiles[i].filename}`;
      const title = titles[i] || '';
      await db.query('INSERT INTO project_images (project_id, image_url, title, display_order) VALUES (?, ?, ?, ?)', 
        [projectId, imageUrl, title, i]);
    }
    res.status(201).json({ message: 'Project created', id: projectId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update project (replace images)
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
    // Handle deleted images
    if (deleteImages) {
      const toDelete = JSON.parse(deleteImages);
      for (let imageId of toDelete) {
        const [rows] = await db.query('SELECT image_url FROM project_images WHERE id = ?', [imageId]);
        if (rows.length) deleteImageFile(rows[0].image_url);
        await db.query('DELETE FROM project_images WHERE id = ?', [imageId]);
      }
    }
    // Add new images
    const titles = imageTitles ? JSON.parse(imageTitles) : [];
    for (let i = 0; i < newImageFiles.length; i++) {
      const imageUrl = `/uploads/${newImageFiles[i].filename}`;
      const title = titles[i] || '';
      await db.query('INSERT INTO project_images (project_id, image_url, title, display_order) VALUES (?, ?, ?, ?)', 
        [id, imageUrl, title, 999]); // display_order can be adjusted
    }
    res.json({ message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete project (cascade deletes images)
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete image files
    const [images] = await db.query('SELECT image_url FROM project_images WHERE project_id = ?', [id]);
    images.forEach(img => deleteImageFile(img.image_url));
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};