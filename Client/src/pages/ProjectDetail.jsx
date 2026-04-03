import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Background3D from '../components/Background3D'; // reuse tsParticles background

import VideoEditor from '../assets/Video-editor.png';
import Inuproject from '../assets/inu.png';
import Hotel from '../assets/hotel-booking.png';

const projectsData = [
  {
    id: 1,
    title: 'Video Editor Portfolio',
    fullDescription: 'A responsive portfolio website for a video editor showcasing projects and skills. Built with React, Express, Resend Mail API, and Tailwind CSS.',
    technologies: ['React', 'Node.js', 'Tailwind CSS'],
    features: ['Responsive design', 'Email contact form'],
    image: VideoEditor,
    liveUrl: 'https://epicedits-siol.vercel.app/',
    githubUrl: 'https://github.com/epicedits-siol/portfolio'
  },
  {
    id: 2,
    title: 'Injibara University Tech Club Platform',
    fullDescription: 'Built a full-stack web application using React.js, Node.js, and MySQL to manage club activities, events, and member registrations for Injibara University Tech Club.',
    technologies: ['React', 'Node.js', 'MySQL', 'Tailwind'],
    features: ['JWT auth', 'Dual registration'],
    image: Inuproject,
    liveUrl: 'https://inu-tech-club.vercel.app',
    githubUrl: 'https://github.com/inu-tech-club'
  },
  {
    id: 3,
    title: 'Hotel Finding and Booking System',
    fullDescription: 'Integrated hotel management and booking system with ACID transactions, allowing users to search for hotels by city or name and book rooms securely.',
    technologies: ['React', 'Node.js', 'MySQL'],
    features: ['Search by city/name', 'Booking system'],
    image: Hotel,
    liveUrl: 'https://hotel-booking-gilt-three.vercel.app',
    githubUrl: 'https://github.com/hotel-booking-system'
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = projectsData.findIndex(p => p.id === parseInt(id));
    return index !== -1 ? index : 0;
  });
  const currentProject = projectsData[currentIndex];

  // Update URL when carousel changes
  useEffect(() => {
    navigate(`/project/${projectsData[currentIndex].id}`, { replace: true });
  }, [currentIndex, navigate]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsData.length);
  };
  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  if (!projectsData.length) {
    return <div className="text-center py-20">No projects found</div>;
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12">
      {/* 3D Background */}
      <Background3D />

      {/* Content overlay */}
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
              {/* Image */}
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img src={currentProject.image} alt={currentProject.title} className="w-full h-auto object-cover" />
              </div>

              {/* Details */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {currentProject.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {currentProject.fullDescription}
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
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition"
                  >
                    <FiExternalLink /> Live Demo
                  </a>
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 glass text-gray-800 dark:text-white rounded-full hover:bg-white/50 transition"
                  >
                    <FiGithub /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Carousel Navigation (Arrows & Dots) */}
            {projectsData.length > 1 && (
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
                  {projectsData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
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