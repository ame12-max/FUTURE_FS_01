import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import NotFound from "./pages/NotFound";
import About from "./components/About";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loader" />
          ) : (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          )}
        </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
