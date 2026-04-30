import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Background3D from '../components/Background3D';

// ✅ central base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

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
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  // ✅ FIXED API CALL
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/projects`);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    formData.append('deleteImages', JSON.stringify(imagesToDelete));
    formData.append('imageTitles', JSON.stringify(imageFiles.map(img => img.title)));
    imageFiles.forEach(img => formData.append('images', img.file));

    try {
      if (form.id) {
        await axios.put(`${API_BASE}/api/projects/${form.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Project updated!' });
      } else {
        await axios.post(`${API_BASE}/api/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage({ type: 'success', text: 'Project added!' });
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED IMAGE URL
  const getImageUrl = (path) => `${API_BASE}${path}`;

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Background3D />
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

          {/* Projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const images = project.images || [];
              const index = previewIndex[project.id] || 0;

              return (
                <div key={project.id} className="glass p-4 rounded-xl">
                  {images.length > 0 && (
                    <div className="relative h-32 mb-3">
                      <img
                        src={getImageUrl(images[index]?.image_url)}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}

                  <h3 className="text-lg text-white">{project.title}</h3>

                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handleDelete(project.id)} className="text-red-500">
                      <FiTrash2 />
                    </button>
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
