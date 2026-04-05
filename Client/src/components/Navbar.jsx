import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Home",
    "About",
    'Education',
    "Skills",
    "Projects",
    "Experience",
    "Contact",
  ];

  // Function to render the appropriate link based on current page
  const renderLink = (item, onClick) => {
    if (item === "Socials") {
      // Socials always routes to /socials
      return (
        <RouterLink
          key={item}
          to="/socials"
          onClick={onClick}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {item}
        </RouterLink>
      );
    } else if (isHomePage) {
      // On homepage, use ScrollLink for smooth scrolling
      return (
        <ScrollLink
          key={item}
          to={item.toLowerCase()}
          spy={true}
          smooth={true}
          duration={500}
          activeClass="text-purple-500 border-b-2 border-purple-500"
          onClick={onClick}
          className="text-gray-700 font-[20px] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {item}
        </ScrollLink>
      );
    } else {
      // On other pages, navigate to home page
      return (
        <RouterLink
          key={item}
          to="/"
          onClick={onClick}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {item}
        </RouterLink>
      );
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center headline">
        {/* Logo - always scrolls to top on homepage, or goes home */}
        {isHomePage ? (
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="text-2xl font-bold cursor-pointer"
          >
            <span className="gradient-text">Amare</span>
          </ScrollLink>
        ) : (
          <RouterLink to="/" className="text-2xl font-bold cursor-pointer">
            <span className="gradient-text">Amare</span>
          </RouterLink>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => renderLink(item))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-800 dark:text-white"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass absolute top-full left-0 w-full py-4"
        >
          <div className="flex flex-col items-center space-y-4 headline">
            {navItems.map((item) => renderLink(item, () => setIsOpen(false)))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;