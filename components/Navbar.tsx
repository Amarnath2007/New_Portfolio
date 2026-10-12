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

  // Lock background scrolling completely when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on resize to desktop and on Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-200 ${
        menuOpen
          ? "bg-[#0B0B0C] border-b border-[#302D28]"
          : scrolled
          ? "bg-[#0B0B0C]/95 backdrop-blur-xl border-b border-[#302D28]/70 shadow-lg"
          : "bg-[#0B0B0C] md:bg-transparent backdrop-blur-none border-b border-[#302D28]/40 md:border-b-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="text-xl font-bold cursor-pointer font-heading tracking-tight select-none z-10"
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

          {/* Contact Button (Desktop) */}
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

          {/* Mobile Menu Toggle Button (in header) */}
          <button
            className={`lg:hidden p-2 rounded-xl border transition-colors ${
              menuOpen
                ? "bg-[#202023] border-[#C7A46A]/50 text-[#C7A46A]"
                : "bg-[#151517] border-[#302D28] text-[#A7A198] hover:text-[#F4F0E8]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Expanded Mobile Navigation Menu Overlay (Placed directly below header, 100% opaque, spans full width) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 sm:top-20 left-0 right-0 bottom-0 w-full h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] bg-[#0B0B0C] border-t border-[#302D28]/80 z-[99] lg:hidden overflow-y-auto"
            style={{ backgroundColor: "#0B0B0C" }}
          >
            <div className="flex flex-col justify-between min-h-full px-4 xs:px-6 sm:px-8 py-6 max-w-lg mx-auto w-full">
              {/* Vertical Navigation Links */}
              <div className="flex flex-col gap-2.5 w-full">
                {navLinks.map((link, idx) => {
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      onClick={() => scrollTo(link.href)}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left transition-all text-sm font-semibold border ${
                        isActive
                          ? "bg-[#C7A46A]/10 text-[#C7A46A] border-[#C7A46A]/40 shadow-sm"
                          : "bg-[#151517] text-[#F4F0E8] border-[#302D28] hover:border-[#C7A46A]/40 hover:text-[#C7A46A]"
                      }`}
                    >
                      <span className="tracking-tight">{link.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A] shadow-[0_0_6px_#C7A46A]" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Primary Action Contact Button */}
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navLinks.length * 0.03 }}
                  onClick={() => scrollTo("#contact")}
                  className="flex items-center justify-center w-full px-4 py-3.5 mt-1.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C7A46A] text-[#151517] hover:bg-[#D8BC8A] transition-all shadow-lg shadow-[#C7A46A]/15 active:scale-[0.99]"
                >
                  Contact Me
                </motion.button>
              </div>

              {/* Social Connect Footer */}
              <div className="mt-8 pt-6 border-t border-[#302D28] w-full">
                <p className="text-[11px] font-semibold text-[#A7A198] uppercase tracking-widest mb-3.5 text-center">
                  Connect With Me
                </p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    {
                      icon: Mail,
                      href: "https://mail.google.com/mail/?view=cm&fs=1&to=amarmicrosoft2021@gmail.com",
                      label: "Email",
                    },
                    {
                      icon: Github,
                      href: "https://github.com/Amarnath2007",
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/in/amarnath2007",
                      label: "LinkedIn",
                    },
                    {
                      icon: Instagram,
                      href: "https://www.instagram.com/da_matrix_404?igsh=MWpvbW15NXU4MG5sbA==",
                      label: "Instagram",
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#151517] text-[#A7A198] hover:bg-[#C7A46A] hover:text-[#151517] border border-[#302D28] hover:border-[#C7A46A] transition-all"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
