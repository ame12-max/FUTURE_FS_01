// src/components/Education.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGraduationCap } from 'react-icons/fa';

const Education = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const education = {
    degree: "Bachelor of Science in Information System (3rd Year)",
    institution: "Injibara University",
    duration: "2022 – Present",
    description: "Relevant coursework: Data Structures, Web Development, Database Systems, Mobile App development,  Software Engineering.",
    gpa: "Good academic standing with a focus on software development and data management."
  };

  return (
    <section ref={ref} className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Education
          </h2>
          <div className="glass rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="text-5xl text-purple-500">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">{education.degree}</h3>
              <p className="text-gray-600 dark:text-gray-400">{education.institution} | {education.duration}</p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{education.description}</p>
              {education.gpa && <p className="mt-2 text-sm text-purple-500">GPA: {education.gpa}</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;