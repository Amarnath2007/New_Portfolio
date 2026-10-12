"use client";

import { motion } from "framer-motion";
import { ChevronUp, Mail, Github, Linkedin, Instagram } from "lucide-react";

const navLinks = [
  "Home",
  "Skills",
  "Achievements",
  "Certifications",
  "Projects",
  "About",
  "Contact",
];

export default function Footer() {
  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
 
  return (
    <footer className="relative z-10 border-t border-[#302D28] pt-16 pb-12 bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Content Group */}
        <div className="flex flex-col items-center gap-8 mb-12">
          {/* Logo */}
          <div className="text-3xl font-bold flex flex-col items-center gap-1.5 font-heading">
            <div>
              <span className="text-[#F4F0E8]">Portfolio</span>
              <span className="text-[#C7A46A]">.</span>
            </div>
            <div className="h-0.5 w-8 bg-[#C7A46A] rounded-full" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-3">
            {[
              { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=amarmicrosoft2021@gmail.com", label: "Email" },
              { icon: Github, href: "https://github.com/Amarnath2007", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/amarnath2007", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/da_matrix_404?igsh=MWpvbW15NXU4MG5sbA==", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={href}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#151517] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-all shadow-md"
                aria-label={label}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 border-y border-[#302D28]/60 py-6">
          {navLinks.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-[#A7A198] hover:text-[#C7A46A] text-xs font-semibold transition-colors uppercase tracking-widest"
            >
              {l}
            </button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[#A7A198]/70 text-xs sm:text-sm order-last sm:order-first">
            © 2026 Amarnath B. All Rights Reserved.
          </p>

          {/* Scroll to top */}
          <motion.button
            onClick={scrollTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151517] border border-[#302D28] text-[#C7A46A] hover:border-[#C7A46A]/50 hover:bg-[#C7A46A]/10 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <span>Back to top</span>
            <ChevronUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
