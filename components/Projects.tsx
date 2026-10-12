"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ChevronLeft, ChevronRight, Download } from "lucide-react";
import SectionDivider from "./SectionDivider";

const projects = [
  {
    letter: "T",
    title: "Tunic Music",
    subtitle: "Mobile App · 2026",
    description:
      "A premium music streaming application featuring a library of 500+ songs with a Spotify-inspired user experience.",
    highlights: ["Built with Flutter and Kotlin", "Integrated with Cloudinary for seamless media hosting", "Advanced playback controls and playlist management"],
    tags: ["Flutter", "Kotlin", "Cloudinary"],
    download: "https://ydfjuomyveiwbxejkjvh.supabase.co/storage/v1/object/sign/Apps/Tunic_music_by_Amar.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81N2RmMTE0ZC1iNTk5LTRhN2ItYjk1ZS02ZDJhYjA0NWZiMTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcHBzL1R1bmljX211c2ljX2J5X0FtYXIuYXBrIiwiaWF0IjoxNzc4ODIwNzczLCJleHAiOjE5MzY1MDA3NzN9.BQpxvEi3oVdrAoFjPy-NuKtezOKsABWQRDD8Uzns0ho", 
    contactSource: true,
    topProject: true,
  },
  {
    letter: "F",
    title: "Flames Game",
    subtitle: "Personal · 2025",
    description:
      "A fun interactive logic-based game built to demonstrate creative problem solving and algorithm design.",
    highlights: ["Interactive terminal-style interface", "Calculates relationship outcomes with FLAMES formula"],
    tags: ["HTML", "CSS", "JavaScript"],
    contactSource: true,
    demo: "https://flames-lilac.vercel.app",
    topProject: true,
  },
  {
    letter: "P",
    title: "Personal Portfolio",
    subtitle: "Personal · 2026",
    description:
      "A modern, high-performance portfolio website built to showcase my professional journey.",
    highlights: ["Built with Next.js and Tailwind CSS", "Features smooth animations and dark mode"],
    tags: ["Next.js", "React", "Tailwind CSS"],
    github: "https://github.com/Amarnath2007/Portfolio",
    demo: "https://amar-portfolio-26.vercel.app",
    topProject: true,
  },
  {
    letter: "B",
    title: "Banking System",
    subtitle: "Personal · 2024",
    description:
      "A robust command-line banking application featuring secure user authentication.",
    highlights: ["Balance management and transaction history", "File-based data persistence"],
    tags: ["C", "File Handling", "Algorithms"],
    github: "https://github.com/Amarnath2007/Bank_System-using-C.git",
    topProject: false,
  },
  {
    letter: "B",
    title: "Birthday Web Gift",
    subtitle: "Personal · 2026",
    description:
      "A personalized web-based gift crafted with AI tools, featuring a heartfelt user experience.",
    highlights: ["Smooth animations and confetti effects", "Combines creative vision with technical execution"],
    tags: ["HTML", "CSS", "AI Tools"],
    github: "https://github.com/Amarnath2007/Template_birthday.git",
    demo: "https://template-birthday.vercel.app",
  },
  {
    letter: "C",
    title: "Chatting System",
    subtitle: "Personal · 2024",
    description:
      "A real-time chat application allowing multiple users to connect, send and receive messages simultaneously.",
    highlights: ["Built in C using TCP socket programming", "Efficient communication handling over a network"],
    tags: ["C", "Networking", "Real-time"],
    github: "https://github.com/Amarnath2007/Chat_System-using-C.git",
  },
];

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.2 : scrollLeft + clientWidth / 1.2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2.5 font-heading">
            MY WORK
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Projects
          </h2>
        </motion.div>

        {/* Horizontally Scrollable Carousel */}
        <div className="relative w-full group/carousel">
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 md:px-1 items-stretch [&::-webkit-scrollbar]:hidden" 
            style={{ scrollbarWidth: 'none' }}
          >
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#151517] rounded-2xl md:rounded-3xl overflow-hidden group flex-shrink-0 w-[88%] sm:w-[460px] flex flex-col justify-between transition-all duration-300 snap-center sm:snap-start border border-[#302D28] hover:border-[#C7A46A]/40 shadow-xl"
              >
                {/* Thumbnail / Header */}
                <div className="h-44 sm:h-40 bg-gradient-to-br from-[#202023] via-[#18181A] to-[#151517] flex items-center justify-center relative overflow-hidden shrink-0 border-b border-[#302D28]">
                  <div className="absolute inset-0 bg-radial from-[#C7A46A]/10 to-transparent opacity-40" />
                  <span className="text-7xl sm:text-6xl font-extrabold relative z-10 select-none font-heading text-[#C7A46A]/80 tracking-tight">
                    {p.letter}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 relative flex flex-col flex-grow justify-between">
                  <div>
                    {p.topProject && (
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center justify-center border border-[#C7A46A]/40 bg-[#C7A46A]/15 text-[#C7A46A]">
                        Top Project
                      </div>
                    )}
                    <h3 className="text-[#F4F0E8] font-bold text-lg sm:text-xl mb-1 font-heading">{p.title}</h3>
                    <p className="text-xs sm:text-sm mb-2.5 font-semibold text-[#C7A46A]">
                      {p.subtitle}
                    </p>
                    <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-5">
                      {p.description}
                    </p>
                    <div className="mb-5 space-y-2">
                      {p.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#C7A46A] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C7A46A] shrink-0" />
                          <span className="text-[#F4F0E8]/90 text-xs sm:text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-[#302D28] gap-4 mt-auto">
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg bg-[#202023] text-[#A7A198] text-[11px] font-medium border border-[#302D28]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2.5 items-center justify-between sm:justify-end border-t sm:border-none border-[#302D28] pt-3 sm:pt-0">
                      <span className="sm:hidden text-[#A7A198] text-xs font-medium uppercase tracking-widest">Links</span>
                      <div className="flex gap-2.5">
                        {p.github && (
                          <motion.a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0"
                            title="Source Code"
                            aria-label="Source Code"
                          >
                            <Github size={16} />
                          </motion.a>
                        )}
                        {p.contactSource && (
                          <button 
                            onClick={() => alert("Please contact the owner directly for the source code of this project.")}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0"
                            title="Contact owner for source code"
                            aria-label="Contact owner for source code"
                          >
                            <Github size={16} className="opacity-60" />
                          </button>
                        )}
                        {p.download && (
                          <motion.a
                            href={p.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#C7A46A]/15 border border-[#C7A46A]/40 text-[#C7A46A] hover:bg-[#C7A46A] hover:text-[#191919] transition-colors shrink-0"
                            title="Download APK"
                            aria-label="Download APK"
                          >
                            <Download size={16} />
                          </motion.a>
                        )}
                        {p.demo && (
                          <motion.a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0"
                            title="Live Demo"
                            aria-label="Live Demo"
                          >
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] hidden sm:flex shadow-2xl"
            aria-label="Previous projects"
          >
            <ChevronLeft size={22} />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] flex shadow-2xl"
            aria-label="Next projects"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
      <SectionDivider />
    </section>
  );
}
