import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { useTypewriter } from "../hooks/useTypewriter";
import profile from "../assets/profile.png";
import resumePDF from "../assets/resume.pdf"; // Ensure you have a resume.pdf in assets

const Hero = () => {
  const [text] = useTypewriter({
    words: [
      "Fullstack Developer",
      "Software Engineer",
      "Problem Solver",
    ],
    loop: true,
    delay: 70,
    deleteSpeed: 50,
  });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumePDF;
    link.download = "Amare_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="home"
      className="py-20 relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative inline-block mb-8"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl mx-auto">
              <img
                src={profile}
                alt="Amare"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping"></div>
          </motion.div>

          <motion.p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Hello, I'm
          </motion.p>
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">Amare</span>
          </motion.h1>
          <motion.div className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6 h-12">
            <span>{text}</span>
          </motion.div>
          <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            I craft digital experiences that are fast, accessible, and visually
            appealing.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FiDownload /> Download Resume
            </button>
            <a
              href="#contact"
              className="px-8 py-3 glass text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
