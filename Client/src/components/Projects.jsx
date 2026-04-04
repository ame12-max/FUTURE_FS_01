import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects`);
        // Parse tags/technologies/features from comma strings to arrays
        const parsedProjects = res.data.map(project => ({
          ...project,
          tags: project.tags ? (Array.isArray(project.tags) ? project.tags : project.tags.split(',').map(s => s.trim())) : [],
          technologies: project.technologies ? (Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map(s => s.trim())) : [],
          features: project.features ? (Array.isArray(project.features) ? project.features : project.features.split(',').map(s => s.trim())) : [],
          // Use first image from images array as main image
          mainImage: project.images && project.images.length > 0 ? `${API_BASE}${project.images[0].image_url}` : null,
          // Keep full images array for detail page
          images: project.images || []
        }));
        setProjects(parsedProjects);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'fullstack', label: 'Fullstack' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const totalPages = Math.ceil(filteredProjects.length / cardsPerView);
  const maxIndex = Math.max(0, totalPages - 1);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <div className="text-gray-600 dark:text-gray-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={ref} className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              My <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of my recent works that showcase my skills and experience.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-200/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Carousel Container */}
          {filteredProjects.length > 0 && (
            <div className="relative overflow-hidden" ref={carouselRef}>
              {totalPages > 1 && currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass hover:bg-purple-500/20 transition"
                  aria-label="Previous projects"
                >
                  <FiChevronLeft size={24} />
                </button>
              )}

              {totalPages > 1 && currentIndex < maxIndex && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass hover:bg-purple-500/20 transition"
                  aria-label="Next projects"
                >
                  <FiChevronRight size={24} />
                </button>
              )}

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {Array.from({ length: totalPages }).map((_, pageIdx) => (
                    <div key={pageIdx} className="flex w-full flex-shrink-0 gap-6 px-2">
                      {filteredProjects
                        .slice(pageIdx * cardsPerView, (pageIdx + 1) * cardsPerView)
                        .map((project) => (
                          <div key={project.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
                            <Link
                              to={`/project/${project.id}`}
                              className="glass rounded-2xl overflow-hidden group h-full block transition-transform duration-300 hover:scale-[1.02]"
                            >
                              <div className="relative overflow-hidden h-48">
                                {project.mainImage ? (
                                  <img
                                    src={project.mainImage}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                    No image
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                  {project.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                  {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tags && project.tags.slice(0, 4).map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-4">
                                    <a
                                      href={project.live_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-2xl text-gray-600 dark:text-gray-400 hover:text-purple-500 transition"
                                      aria-label="Live Demo"
                                    >
                                      <FiExternalLink />
                                    </a>
                                    <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-2xl text-gray-600 dark:text-gray-400 hover:text-purple-500 transition"
                                      aria-label="GitHub"
                                    >
                                      <FiGithub />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-6 bg-purple-500'
                          : 'bg-gray-400 dark:bg-gray-600 hover:bg-purple-300'
                      }`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;