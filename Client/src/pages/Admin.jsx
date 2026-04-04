import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit, FiPlus, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Background3D from '../components/Background3D';

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    full_description: '',
    live_url: '',
    github_url: '',
    technologies: '',
    features: '',
    category: 'fullstack',
    tags: '',
  });
  const [imageFiles, setImageFiles] = useState([]); // array of { file, title }
  const [existingImages, setExistingImages] = useState([]); // from DB
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  // State for per-project slideshow index (for preview in list)
  const [previewIndex, setPreviewIndex] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProjects();
  }, [token]);

  const parseStringToArray = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split(',').map(s => s.trim()).filter(s => s);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/projects');
      const parsedProjects = res.data.map(project => ({
        ...project,
        tags: parseStringToArray(project.tags),
        technologies: parseStringToArray(project.technologies),
        features: parseStringToArray(project.features),
      }));
      setProjects(parsedProjects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: '',
      description: '',
      full_description: '',
      live_url: '',
      github_url: '',
      technologies: '',
      features: '',
      category: 'fullstack',
      tags: '',
    });
    setImageFiles([]);
    setExistingImages([]);
    setImagesToDelete([]);
  };

  const handleEdit = (project) => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description || '',
      full_description: project.full_description || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      features: Array.isArray(project.features) ? project.features.join(', ') : '',
      category: project.category || 'fullstack',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
    });
    setExistingImages(project.images || []);
    setImageFiles([]);
    setImagesToDelete([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      if (form.id === id) resetForm();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Handle multiple file selection (append to existing)
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ file, title: '' }));
    setImageFiles(prev => [...prev, ...newImages]);
  };

  const handleImageTitleChange = (index, value) => {
    const updated = [...imageFiles];
    updated[index].title = value;
    setImageFiles(updated);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingImage = (imageId) => {
    setImagesToDelete(prev =>
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('full_description', form.full_description);
    formData.append('live_url', form.live_url);
    formData.append('github_url', form.github_url);
    formData.append('technologies', form.technologies);
    formData.append('features', form.features);
    formData.append('category', form.category);
    formData.append('tags', form.tags);
    formData.append('deleteImages', JSON.stringify(imagesToDelete));
    formData.append('imageTitles', JSON.stringify(imageFiles.map(img => img.title)));
    imageFiles.forEach(img => formData.append('images', img.file));

    try {
      if (form.id) {
        await axios.put(`http://localhost:3000/api/projects/${form.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Project updated!' });
      } else {
        await axios.post('http://localhost:3000/api/projects', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Project added!' });
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slideshow for project list preview
  const nextPreview = (projectId, totalImages) => {
    setPreviewIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] + 1) % totalImages
    }));
  };
  const prevPreview = (projectId, totalImages) => {
    setPreviewIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] - 1 + totalImages) % totalImages
    }));
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Background3D />
        <div className="relative z-10 text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <Background3D />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your projects – add, edit, or delete.</p>

          {/* Form Card */}
          <div className="glass rounded-2xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {form.id ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* ... same form fields as before ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <option value="frontend">Frontend</option><option value="fullstack">Fullstack</option><option value="backend">Backend</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                  <textarea rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description</label>
                  <textarea rows="4" value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
                  <input type="url" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                  <input type="url" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma separated)</label>
                  <input type="text" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MySQL" className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (comma separated)</label>
                  <input type="text" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="JWT auth, Payment, Search" className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, Tailwind, API" className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-dark-200/70 border border-gray-300 dark:border-gray-600" />
                </div>
              </div>

              {/* Existing Images (from DB) */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Images</label>
                  <div className="flex flex-wrap gap-4">
                    {existingImages.map(img => (
                      <div key={img.id} className="relative w-32">
                        <img src={`http://localhost:3000${img.image_url}`} alt={img.title} className="w-full h-24 object-cover rounded-lg" />
                        <p className="text-xs text-center mt-1 truncate">{img.title}</p>
                        <button type="button" onClick={() => toggleDeleteExistingImage(img.id)} className={`absolute top-1 right-1 p-1 rounded-full ${imagesToDelete.includes(img.id) ? 'bg-red-500' : 'bg-gray-800/70'} text-white`}><FiX size={12} /></button>
                      </div>
                    ))}
                  </div>
                  {imagesToDelete.length > 0 && <p className="text-sm text-red-500 mt-2">{imagesToDelete.length} image(s) marked for deletion</p>}
                </div>
              )}

              {/* New Images Upload (appending) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add New Images (select multiple at once or add more later)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                {imageFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {imageFiles.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/50 dark:bg-dark-200/50 p-2 rounded-lg">
                        <span className="text-sm truncate flex-1">{img.file.name}</span>
                        <input type="text" placeholder="Image title" value={img.title} onChange={e => handleImageTitleChange(idx, e.target.value)} className="px-2 py-1 text-sm rounded bg-white/70 dark:bg-dark-200/70 border border-gray-300" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="text-red-500"><FiX /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message && <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{message.text}</div>}

              <div className="flex gap-3">
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg disabled:opacity-50">{isSubmitting ? 'Saving...' : form.id ? 'Update Project' : 'Add Project'}</button>
                {form.id && <button type="button" onClick={resetForm} className="px-6 py-2 glass text-gray-800 dark:text-white rounded-full">Cancel Edit</button>}
              </div>
            </form>
          </div>

          {/* Projects List with Image Slideshow Preview */}
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const images = project.images || [];
              const currentPreviewIndex = previewIndex[project.id] || 0;
              return (
                <div key={project.id} className="glass rounded-2xl p-5 flex flex-col">
                  {/* Image Slideshow Preview */}
                  {images.length > 0 && (
                    <div className="relative mb-3 rounded-lg overflow-hidden h-32 bg-gray-200 dark:bg-gray-700">
                      <img src={`http://localhost:3000${images[currentPreviewIndex]?.image_url}`} alt={images[currentPreviewIndex]?.title || project.title} className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <>
                          <button onClick={() => prevPreview(project.id, images.length)} className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"><FiChevronLeft size={16} /></button>
                          <button onClick={() => nextPreview(project.id, images.length)} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"><FiChevronRight size={16} /></button>
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                            {images.map((_, idx) => (
                              <button key={idx} onClick={() => setPreviewIndex(prev => ({ ...prev, [project.id]: idx }))} className={`w-1.5 h-1.5 rounded-full ${idx === currentPreviewIndex ? 'bg-white' : 'bg-white/50'}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags && project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => handleEdit(project)} className="flex items-center gap-1 text-blue-500 hover:text-blue-600"><FiEdit /> Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="flex items-center gap-1 text-red-500 hover:text-red-600"><FiTrash2 /> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;