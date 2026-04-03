import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mt-4">Page Not Found</p>
        <Link to="/" className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;