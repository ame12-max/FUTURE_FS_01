import { useInView } from 'react-intersection-observer';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import profile from '../assets/profile.png';

const Counter = ({ value, label }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const spring = useSpring(0, { damping: 20, stiffness: 50 });
  const display = useTransform(spring, (val) => Math.floor(val));

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.div className="text-4xl font-bold gradient-text">{display}</motion.div>
      <div className="text-gray-600 dark:text-gray-400 mt-2">{label}</div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-5"
        >
          About <span className="gradient-text">Me</span>
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/3"
          >
            <div className="glass p-1 rounded-2xl">
              <img src={profile} alt="Amare" className="rounded-2xl w-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-2/3"
          >
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            I'm a passionate Full-Stack Developer who enjoys building reliable systems and modern web applications. I focus on writing clean, scalable code and creating efficient solutions to real-world problems while continuously learning new technologies.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
              <Counter value={1} label="Years Experience" />
              <Counter value={20} label="Projects Completed" />
              <Counter value={5} label="Technologies" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;