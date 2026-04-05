import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Education = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const education = {
    degree: "Bachelor of Science in Information System",
    year: "3rd Year (2022 – Present)",
    institution: "Injibara University",
    location: "Injibara, Ethiopia",
    description: "Currently pursuing a Bachelor's degree with a focus on full‑stack web development, database systems, and software engineering. Active participant in university tech clubs and open‑source contributions.",
    relevantCourses: [
      "Data Structures & Algorithms",
      "Web Development (React, Node.js)",
      "Mobile App Development (Flutter",
      "Database Management Systems (MySQL)",
      "Software Engineering",
      "Object‑Oriented Programming"
    ],
    achievements: [
      "Academic Excellence Scholarship (2023)",
      "Lead Developer – University Tech Club Platform"
    ]
  };

  return (
    <section
      id="education"
      ref={ref}
      className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Education</span>
          </h2>

          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl text-purple-500">
                  <FaGraduationCap />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {education.degree}
                </h3>
                <p className="text-purple-500 font-medium mt-1">
                  {education.year}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt size={12} /> {education.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={12} /> {education.year}
                  </span>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {education.description}
                </p>

                {/* Relevant Courses */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    📚 Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {education.relevantCourses.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {education.achievements.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      🏆 Achievements
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {education.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;