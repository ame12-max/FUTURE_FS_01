import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const experiences = [
  {
    year: '2025 - Present',
    title: 'Fullstack Developer (Self-Driven)',
    company: 'Personal Projects',
    description: 'Designing and building fullstack web applications using React, Node.js, Express, and MySQL/PostgreSQL. Focused on authentication systems, dashboards, and real-world features like payments and referrals.',
    icon: '🚀',
  },
  {
    year: '2024 - 2025',
    title: 'Frontend Developer',
    company: 'Personal Projects',
    description: 'Developed responsive and interactive user interfaces using React, Tailwind CSS, and modern JavaScript. Built projects like e-commerce platforms and admin dashboards.',
    icon: '💻',
  },
  {
    year: '2024',
    title: 'Web Development Learner',
    company: 'Self-Learning',
    description: 'Learned core web development fundamentals including HTML, CSS, JavaScript, and backend basics. Built small projects to understand UI/UX, APIs, and database integration.',
    icon: '📚',
  },
];

const TimelineItem = ({ experience, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative mb-12 last:mb-0"
    >
      {/* Timeline line (hidden on mobile) */}
      <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block" />

      <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} items-center`}>
        {/* Timeline dot */}
        <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white dark:border-dark-200 z-10" />

        {/* Content card */}
        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
          <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{experience.icon}</span>
              <span className="text-sm text-purple-500 font-semibold">{experience.year}</span>
            </div>
            <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{experience.title}</h3>
            <h4 className="text-gray-600 dark:text-gray-400 mb-3">{experience.company}</h4>
            <p className="text-gray-700 dark:text-gray-300">{experience.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-white/10 dark:bg-dark-300/10 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          My <span className="gradient-text">Journey</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto relative">
          {experiences.map((exp, idx) => (
            <TimelineItem key={idx} experience={exp} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;