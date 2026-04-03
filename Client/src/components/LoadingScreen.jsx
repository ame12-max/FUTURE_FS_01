import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark-300"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-gray-900 dark:text-white text-sm">AM</div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;