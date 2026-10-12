"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FolderOpen, MapPin, Linkedin, Instagram, Github, Mail } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    if (supabase && supabase.storage) {
      try {
        const { data } = supabase.storage.from("resume").getPublicUrl("Amar_Resume.pdf");
        if (data?.publicUrl) {
          setResumeUrl(data.publicUrl);
        }
      } catch (err) {
        console.error("Error getting resume URL:", err);
      }
    }
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] lg:min-h-screen flex items-center z-10 pt-24 pb-20 lg:py-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full translate-y-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 items-center gap-10 lg:gap-6 py-6 min-h-fit lg:min-h-[calc(100vh-80px)]">

          {/* Left Content (7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left w-full">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 bg-[#151517]/80 border border-[#302D28]/60 rounded-full px-4 py-2 text-xs font-medium text-[#A7A198] w-fit mx-auto lg:mx-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A] shadow-[0_0_6px_#C7A46A]" />
              Tech Enthusiast & Coder
            </motion.div>

            {/* Name Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight font-heading leading-[1.05]">
                <span className="text-[#F4F0E8]">Amarnath </span>
                <span className="text-[#C7A46A] gold-glow">B</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-xl lg:text-[1.35rem] font-medium text-[#C7A46A]/90 tracking-normal"
            >
              Turning Ideas into Impactful Solutions
            </motion.div>

            {/* Bio Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[#A7A198] text-sm sm:text-[0.95rem] lg:text-base leading-[1.7] max-w-[520px] mx-auto lg:mx-0 font-normal"
            >
              I build web applications, real-time systems, and digital solutions using modern AI-powered development tools. I am passionate about technology and creating intuitive user experiences.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Amarnath_B_Resume.pdf"
                whileHover={{ scale: 1.02, backgroundColor: "#D8BC8A" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#C7A46A] text-[#191919] rounded-xl text-sm font-semibold shadow-lg shadow-[#C7A46A]/10 transition-all duration-200"
              >
                <Download size={17} />
                Download Resume
              </motion.a>

              <div className="flex gap-3">
                <motion.button
                  onClick={scrollToProjects}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#151517] border border-[#302D28] hover:border-[#C7A46A]/40 hover:text-[#C7A46A] rounded-xl text-sm font-semibold text-[#F4F0E8] transition-all duration-200"
                >
                  <FolderOpen size={17} />
                  Projects
                </motion.button>

                <motion.button
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#151517] border border-[#302D28] hover:border-[#C7A46A]/40 hover:text-[#C7A46A] rounded-xl text-sm font-semibold text-[#F4F0E8] transition-all duration-200"
                >
                  <Mail size={17} />
                  Contact
                </motion.button>
              </div>
            </motion.div>

            {/* Social Follow Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <span className="hidden sm:inline text-[#A7A198]/70 text-[11px] uppercase tracking-widest font-semibold mr-1">Follow Me</span>
              {[
                { icon: MapPin, href: "#", label: "Location" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/amarnath2007", label: "LinkedIn" },
                { icon: Instagram, href: "https://www.instagram.com/da_matrix_404?igsh=MWpvbW15NXU4MG5sbA==", label: "Instagram" },
                { icon: Github, href: "https://github.com/Amarnath2007", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("#") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#151517]/70 border border-[#302D28]/60 text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/40 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right — Profile Photo (5 columns on desktop, naturally blended) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center w-full"
          >
            {/* Very subtle warm ambient glow behind portrait */}
            <div className="absolute -inset-8 bg-gradient-to-t from-transparent via-[#C7A46A]/[0.03] to-transparent rounded-full blur-3xl -z-10" />

            {/* Naturally blended portrait — zoomed out to show full upper body, shoulders, and suit */}
            <div
              className="relative w-[280px] sm:w-[330px] lg:w-[390px] xl:w-[420px] aspect-[2/3]"
              style={{
                maskImage:
                  'linear-gradient(to bottom, black 0%, black 56%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.35) 78%, transparent 88%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 0%, black 56%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.35) 78%, transparent 88%)',
              }}
            >
              <Image
                src="/photo.png"
                alt="Amarnath B"
                fill
                className="object-contain object-top select-none"
                priority
              />
            </div>

            {/* Minimal "Developer" label */}
            <div className="absolute top-16 sm:top-20 lg:top-24 right-[6%] sm:right-[4%] lg:right-[2%] px-3 py-1 rounded-full bg-[#151517]/80 backdrop-blur-md border border-[#302D28]/60 text-[10px] uppercase tracking-widest text-[#C7A46A] font-semibold shadow-md">
              Developer
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
