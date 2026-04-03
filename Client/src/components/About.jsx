import { useInView } from 'react-intersection-observer';
import { motion, useSpring, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import profile from '../assets/profile.png';

const Counter = ({ value, label, suffix = '+' }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const spring = useSpring(0, { damping: 20, stiffness: 50 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      spring.set(value);
    } else {
      spring.set(0);
    }
  }, [inView, spring, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(Math.floor(latest));
  });

  return (
    <div ref={ref} className="text-center">
      <motion.div className="text-4xl font-bold gradient-text">
        {displayValue}{suffix}
      </motion.div>
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
              I'm a dedicated Full‑Stack Developer with a passion for building robust, user‑centric web applications. 
              I specialize in the MERN stack, RESTful APIs, and modern frontend frameworks. 
              My approach combines clean code, performance optimization, and a keen eye for design. 
              I thrive on solving complex problems and continuously expanding my skill set to stay ahead in the fast‑evolving tech landscape.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
              <Counter value={1} label="Years Experience" suffix="+" />
              <Counter value={20} label="Projects Completed" suffix="+" />
              <Counter value={10} label="Technologies Mastered" suffix="+" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;