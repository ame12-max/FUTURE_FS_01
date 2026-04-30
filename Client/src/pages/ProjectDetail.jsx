import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import Background3D from '../components/Background3D';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://future-fs-01-8c7x.onrender.com';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects`);
        const projects = res.data.map(p => ({
          ...p,
          technologies: p.technologies ? p.technologies.split(',').map(s => s.trim()) : [],
          features: p.features ? p.features.split(',').map(s => s.trim()) : [],
          tags: p.tags ? p.tags.split(',').map(s => s.trim()) : [],
        }));
        setAllProjects(projects);
      } catch (err) {
        console.error(err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Update current project when allProjects or id changes
  useEffect(() => {
    if (allProjects.length === 0) return;
    const index = allProjects.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      setError('Project not found');
      setCurrentProject(null);
    } else {
      setProjectIndex(index);
      setCurrentProject(allProjects[index]);
      setImageIndex(0);
    }
  }, [allProjects, id]);

  // Update URL when project index changes (via next/prev)
  useEffect(() => {
    if (allProjects.length && allProjects[projectIndex]) {
      navigate(`/project/${allProjects[projectIndex].id}`, { replace: true });
    }
  }, [projectIndex, navigate, allProjects]);

  const nextProject = () => {
    setProjectIndex((prev) => (prev + 1) % allProjects.length);
  };
  const prevProject = () => {
    setProjectIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  const nextImage = () => {
    if (currentProject?.images?.length) {
      setImageIndex((prev) => (prev + 1) % currentProject.images.length);
    }
  };
  const prevImage = () => {
    if (currentProject?.images?.length) {
      setImageIndex((prev) => (prev - 1 + currentProject.images.length) % currentProject.images.length);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Background3D />
        <div className="relative z-10 text-white">Loading...</div>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Background3D />
        <div className="relative z-10 text-center">
          <p className="text-white text-xl">{error || 'Project not found'}</p>
          <Link to="/#projects" className="mt-4 inline-block text-purple-400 hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const images = currentProject.images || [];
  const currentImage = images[imageIndex];

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <Background3D />

      <div className="relative z-10 container mx-auto px-6">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600 mb-8 transition">
          <FiArrowLeft /> Back to Projects
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Slideshow */}
              <div>
                <div className="relative rounded-xl overflow-hidden shadow-xl bg-gray-900/20">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imageIndex}
                      src={currentImage ? `${API_BASE}${currentImage.image_url}` : ''}
                      alt={currentImage?.title || currentProject.title}
                      className="w-full h-auto object-cover"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-purple-500/20 transition"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-purple-500/20 transition"
                        aria-label="Next image"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 0 && currentImage && (
                  <div className="text-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {currentImage.title}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === imageIndex
                            ? 'w-4 bg-purple-500'
                            : 'bg-gray-400 dark:bg-gray-600 hover:bg-purple-300'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {currentProject.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {currentProject.full_description}
                </p>

                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies?.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {currentProject.features?.map(f => <li key={f}>{f}</li>)}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={currentProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition"
                  >
                    <FiExternalLink /> Live Demo
                  </a>
                  <a
                    href={currentProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 glass text-gray-800 dark:text-white rounded-full hover:bg-white/50 transition"
                  >
                    <FiGithub /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Project Carousel Navigation (between projects) */}
            {allProjects.length > 1 && (
              <div className="mt-10 flex flex-col items-center">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={prevProject}
                    className="p-2 rounded-full glass hover:bg-purple-500/20 transition"
                    aria-label="Previous project"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextProject}
                    className="p-2 rounded-full glass hover:bg-purple-500/20 transition"
                    aria-label="Next project"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {allProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProjectIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === projectIndex
                          ? 'w-6 bg-purple-500'
                          : 'bg-gray-400 dark:bg-gray-600 hover:bg-purple-300'
                      }`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectDetail;
