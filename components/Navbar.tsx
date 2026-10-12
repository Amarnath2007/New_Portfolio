"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail, Github, Linkedin, Instagram } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Achievements", href: "#achievements" },
  { label: "Certifications", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ["home", "skills", "achievements", "certifications", "projects", "about"];
      for (const sec of sections.reverse()) {
        const el = document.getElementById(sec);
        if (el && window.scrollY >= el.offsetTop - 130) {
          setActiveSection(sec);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    const id = href.startsWith("#") ? href.slice(1) : href;
    const el = document.getElementById(id);
    if (el) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const navOffset = isMobile ? 72 : 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      window.location.href = `/${href}`;
    }
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0B0C]/95 backdrop-blur-xl border-b border-[#302D28]/70 shadow-lg"
          : "bg-[#0B0B0C]/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-[#302D28]/40 md:border-b-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="text-xl font-bold cursor-pointer font-heading tracking-tight"
            whileHover={{ scale: 1.03 }}
            onClick={() => scrollTo("#home")}
          >
            <span className="text-[#F4F0E8]">Portfolio</span>
            <span className="text-[#C7A46A]">.</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#151517]/60 border border-[#302D28]/60 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#C7A46A]/15 text-[#C7A46A] border border-[#C7A46A]/30 shadow-sm"
                      : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.label}
                </motion.button>
              );
            })}
          </div>

          {/* Contact Button */}
          <div className="hidden lg:block">
            <motion.button
              onClick={() => scrollTo("#contact")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#C7A46A]/40 text-[#C7A46A] text-xs uppercase tracking-wider font-semibold hover:bg-[#C7A46A]/10 hover:border-[#C7A46A] transition-all duration-200"
            >
              Contact Me
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#A7A198] hover:text-[#F4F0E8] p-2 rounded-xl bg-[#151517] border border-[#302D28] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide-in */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-[#151517] border-l border-[#302D28] z-50 lg:hidden p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="text-xl font-bold cursor-pointer font-heading" onClick={() => { scrollTo("#home"); setMenuOpen(false); }}>
                  <span className="text-[#F4F0E8]">Portfolio</span>
                  <span className="text-[#C7A46A]">.</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center px-4 py-3.5 text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#202023] rounded-xl transition-all text-sm font-medium border border-transparent hover:border-[#302D28]"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo("#contact")}
                  className="flex items-center justify-center px-4 py-3.5 text-[#C7A46A] bg-[#C7A46A]/10 hover:bg-[#C7A46A]/20 border border-[#C7A46A]/40 rounded-xl transition-all text-sm font-semibold uppercase tracking-wider mt-1"
                >
                  Contact Me
                </button>
              </div>

              <div className="mt-auto pt-6 border-t border-[#302D28]">
                <p className="text-[11px] text-[#A7A198] uppercase tracking-widest mb-4 font-semibold px-4">Socials</p>
                <div className="grid grid-cols-4 gap-2 px-2">
                  {[
                    { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=amarmicrosoft2021@gmail.com" },
                    { icon: Github, href: "https://github.com/Amarnath2007" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/amarnath2007" },
                    { icon: Instagram, href: "https://www.instagram.com/da_matrix_404?igsh=MWpvbW15NXU4MG5sbA==" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#202023] text-[#A7A198] hover:bg-[#C7A46A] hover:text-[#191919] transition-all border border-[#302D28]"
                    >
                      <social.icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
