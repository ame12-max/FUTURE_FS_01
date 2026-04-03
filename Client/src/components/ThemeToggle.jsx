import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full glass hover:bg-gray-200 dark:hover:bg-white/20 transition"
    >
      {isDark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-800 dark:text-gray-200" />}
    </motion.button>
  );
};

export default ThemeToggle;