import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import VideoEditor from '../assets/Video-editor.png';
import Inuproject from '../assets/inu.png';
import Hotel from '../assets/hotel-booking.png';

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const carouselRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: 'Video Editor Portfolio',
      description: 'A responsive portfolio website for a video editor showcasing projects and skills.',
      image: VideoEditor,
      tags: ['React', 'Express', 'Resend Mail API', 'Tailwind CSS'],
      category: 'frontend',
      liveUrl: 'https://epicedits-siol.vercel.app/',
      githubUrl: 'https://github.com/ame12-max/video-editor-porifolio',
      fullDescription: 'Detailed description...',
      technologies: ['React', 'Node.js', 'Tailwind CSS'],
      features: ['Responsive design', 'Email contact form']
    },
    {
      id: 2,
      title: 'Injibara University Tech Club Platform',
      description: 'Built a full-stack web application using React.js, Node.js, and MySQL...',
      image: Inuproject,
      tags: ['React', 'Express', 'Mail API', 'MySQL'],
      category: 'fullstack',
      liveUrl: 'https://inu-tech-club.vercel.app',
      githubUrl: 'https://github.com/ame12-max/tech-club',
      fullDescription: '...',
      technologies: ['React', 'Node.js', 'MySQL', 'Tailwind'],
      features: ['JWT auth', 'Dual registration']
    },
    {
      id: 3,
      title: 'Hotel Finding and Booking System',
      description: 'Integrated hotel management and booking system with ACID transactions...',
      image: Hotel,
      tags: ['React', 'Node.js', 'MySQL'],
      category: 'fullstack',
      liveUrl: 'https://hotel-booking-gilt-three.vercel.app',
      githubUrl: 'https://github.com/ame12-max/Hotel-booking',
      fullDescription: '...',
      technologies: ['React', 'Node.js', 'MySQL'],
      features: ['Search by city/name', 'Booking system']
    }
  ];

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
                            {/* Entire card is a clickable Link */}
                            <Link
                              to={`/project/${project.id}`}
                              className="glass rounded-2xl overflow-hidden group h-full block transition-transform duration-300 hover:scale-[1.02]"
                            >
                              <div className="relative overflow-hidden h-48">
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
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
                                  {project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-4">
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-2xl text-gray-600 dark:text-gray-400 hover:text-purple-500 transition"
                                      aria-label="Live Demo"
                                    >
                                      <FiExternalLink />
                                    </a>
                                    <a
                                      href={project.githubUrl}
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