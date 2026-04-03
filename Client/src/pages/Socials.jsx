import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiYoutube, FiInstagram, FiTwitter } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Background3D from '../components/Background3D'; // or tsParticles version

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/ame12-max', icon: FiGithub, color: '#333' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/amame12', icon: FiLinkedin, color: '#0A66C2' },
  { name: 'YouTube', url: 'https://youtube.com/@TechSpire2112', icon: FiYoutube, color: '#FF0000' },
  { name: 'Telegram', url: 'https://t.me/Techspiree', icon: FaTelegram, color: '#26A5E4' },
  { name: 'Twitter', url: 'https://x.com/AmareA98775', icon: FiTwitter, color: '#1DA1F2' },
  { name: 'Instagram', url: 'https://instagram.com/amex44755', icon: FiInstagram, color: '#E4405F' },
  { name: 'WhatsApp', url: 'https://wa.me/+251969093096', icon: FaWhatsapp, color: '#25D366' },
  { name: 'Email', url: 'mailto:amex44755@gmail.com', icon: FiMail, color: '#EA4335' }, 
  {
    name: 'Telegram Channel',
    url: 'https://t.me/techspire_tech',
    icon: FaTelegram,
    color: '#26A5E4'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/techspire',
    icon: FaFacebook,
    color: '#1877F2'
  }
];

const Socials = () => {
  return (
    <div className="relative min-h-screen pt-24 pb-12">
      <Background3D />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect with <span className="gradient-text">Me</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find me on all your favorite platforms. Let's create something amazing together!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-2xl flex flex-col items-center justify-center group"
            >
              <social.icon
                className="text-5xl mb-3 transition-transform group-hover:scale-110"
                style={{ color: social.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{social.name}</span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Socials;
