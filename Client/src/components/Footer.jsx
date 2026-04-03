const Footer = () => {
  return (
    <footer className="py-6 bg-white/80 dark:bg-dark-300/60 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Amare. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;