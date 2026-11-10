"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, ExternalLink, Download, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionDivider from "./SectionDivider";
import { Project } from "@/lib/portfolio-data";

const defaultProjects = [
  {
    letter: "T",
    title: "Tunic Music",
    subtitle: "Mobile App · 2026",
    description:
      "A premium music streaming application featuring a library of 500+ songs with a Spotify-inspired user experience.",
    highlights: [
      "Built with Flutter and Kotlin",
      "Integrated with Cloudinary for seamless media hosting",
      "Advanced playback controls and playlist management",
    ],
    tags: ["Flutter", "Kotlin", "Cloudinary"],
    download:
      "https://ydfjuomyveiwbxejkjvh.supabase.co/storage/v1/object/sign/Apps/Tunic_music_by_Amar.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81N2RmMTE0ZC1iNTk5LTRhN2ItYjk1ZS02ZDJhYjA0NWZiMTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcHBzL1R1bmljX211c2ljX2J5X0FtYXIuYXBrIiwiaWF0IjoxNzc4ODIwNzczLCJleHAiOjE5MzY1MDA3NzN9.BQpxvEi3oVdrAoFjPy-NuKtezOKsABWQRDD8Uzns0ho",
    contactSource: true,
  },
  {
    letter: "F",
    title: "Flames Game",
    subtitle: "Personal · 2025",
    description:
      "A fun interactive logic-based game built to demonstrate creative problem solving and algorithm design.",
    highlights: [
      "Interactive terminal-style interface",
      "Calculates relationship outcomes with FLAMES formula",
    ],
    tags: ["HTML", "CSS", "JavaScript"],
    contactSource: true,
    demo: "https://flames-lilac.vercel.app",
  },
  {
    letter: "P",
    title: "Personal Portfolio",
    subtitle: "Personal · 2026",
    description:
      "A modern, high-performance portfolio website built to showcase my professional journey.",
    highlights: [
      "Built with Next.js and Tailwind CSS",
      "Features smooth animations and dark mode",
    ],
    tags: ["Next.js", "React", "Tailwind CSS"],
    github: "https://github.com/Amarnath2007/Portfolio",
    demo: "https://amar-portfolio-26.vercel.app",
  },
  {
    letter: "B",
    title: "Banking System",
    subtitle: "Personal · 2024",
    description:
      "A robust command-line banking application featuring secure user authentication.",
    highlights: [
      "Balance management and transaction history",
      "File-based data persistence",
    ],
    tags: ["C", "File Handling", "Algorithms"],
    github: "https://github.com/Amarnath2007/Bank_System-using-C.git",
  },
  {
    letter: "B",
    title: "Birthday Web Gift",
    subtitle: "Personal · 2026",
    description:
      "A personalized web-based gift crafted with AI tools, featuring a heartfelt user experience.",
    highlights: [
      "Smooth animations and confetti effects",
      "Combines creative vision with technical execution",
    ],
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
    highlights: [
      "Built in C using TCP socket programming",
      "Efficient communication handling over a network",
    ],
    tags: ["C", "Networking", "Real-time"],
    github: "https://github.com/Amarnath2007/Chat_System-using-C.git",
  },
];

interface ProjectsProps {
  data?: Project[];
}

export default function Projects({ data }: ProjectsProps) {
  const items = data && data.length > 0 ? data : defaultProjects;
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with subtle entrance */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2.5 font-heading">
            — MY WORK —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight mb-3">
            Featured Projects
          </h2>
          <p className="text-xs sm:text-sm text-[#A7A198] max-w-xl mx-auto font-sans leading-relaxed">
            A curated collection of web applications, mobile tools, and systems I have engineered.
          </p>
        </motion.div>

        {/* Horizontal Scrollable Carousel */}
        <div className="relative group/carousel">
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 items-stretch [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((p: any, i: number) => {
              const primaryActionLink = p.demo || p.download || p.github;

              return (
                <motion.div
                  key={p.id || p.title || i}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : i * 0.08,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  className="group relative flex-shrink-0 w-[85vw] max-w-[340px] sm:w-[360px] md:w-[380px] snap-start flex flex-col justify-between rounded-2xl md:rounded-3xl bg-[#141416]/95 border border-[#302D28] hover:border-[#C7A46A]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_25px_rgba(199,164,106,0.12)] overflow-hidden cursor-default"
                >
                {/* Top Subtle Hover Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C7A46A]/0 group-hover:via-[#C7A46A]/70 to-transparent transition-all duration-500 z-30" />

                {/* 1. Project Image / Monogram Area with consistent aspect ratio */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-br from-[#1C1C20] via-[#161619] to-[#111113] border-b border-[#302D28] shrink-0">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                      {/* Geometric grid watermark */}
                      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#C7A46A_1px,transparent_1px),linear-gradient(to_bottom,#C7A46A_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      {/* Radial gold ambient glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,164,106,0.12),transparent_70%)] opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      {/* Monogram Letter */}
                      <span className="text-6xl sm:text-7xl font-extrabold font-heading text-[#C7A46A]/75 select-none transition-all duration-500 ease-out group-hover:scale-110 group-hover:text-[#C7A46A] tracking-tight relative z-10">
                        {p.letter || (p.title ? p.title[0] : "P")}
                      </span>
                    </div>
                  )}

                  {/* Dark overlay that fades in smoothly on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/40 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none z-10" />

                  {/* Subtitle Badge (Top Left) */}
                  <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0B0B0C]/85 backdrop-blur-md text-[#C7A46A] border border-[#C7A46A]/30 shadow-md">
                    {p.subtitle}
                  </div>

                  {/* Animated Arrow Indicator (Top Right) */}
                  {primaryActionLink ? (
                    <a
                      href={primaryActionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0B0B0C]/85 backdrop-blur-md border border-[#302D28] group-hover:border-[#C7A46A]/60 flex items-center justify-center text-[#A7A198] group-hover:text-[#C7A46A] transition-all duration-300 shadow-md"
                      title="Open Project"
                      aria-label="Open Project"
                    >
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0B0B0C]/85 backdrop-blur-md border border-[#302D28] group-hover:border-[#C7A46A]/60 flex items-center justify-center text-[#A7A198] group-hover:text-[#C7A46A] transition-all duration-300 shadow-md">
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Card Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between relative z-20">
                  <div>
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#F4F0E8] font-heading group-hover:text-white transition-colors leading-snug mb-2">
                      {p.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed mb-4 group-hover:text-[#D1CBC3] transition-colors line-clamp-3">
                      {p.description}
                    </p>

                    {/* Highlights list */}
                    <div className="space-y-1.5 mb-5">
                      {(p.highlights || []).map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#A7A198]/90">
                          <span className="text-[#C7A46A] mt-1.5 w-1 h-1 rounded-full bg-[#C7A46A] shrink-0" />
                          <span className="leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Tech stack badges & Action Links */}
                  <div className="pt-3 border-t border-[#302D28]/80 mt-auto">
                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(p.tags || []).map((t: string) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg bg-[#1F1F23] text-[#A7A198] text-[11px] font-medium border border-[#302D28] group-hover:border-[#C7A46A]/30 group-hover:text-[#F4F0E8] transition-all duration-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Action Links - Touch friendly & always accessible */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A7A198]/60">
                        Links
                      </span>

                      <div className="flex items-center gap-2">
                        {p.github && (
                          <motion.a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0 shadow-sm"
                            title="Source Code"
                            aria-label="Source Code"
                          >
                            <Github size={16} />
                          </motion.a>
                        )}

                        {p.contactSource && (
                          <button
                            onClick={() =>
                              alert("Please contact the owner directly for the source code of this project.")
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0 shadow-sm"
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
                            className="px-3 h-9 flex items-center gap-1.5 rounded-xl bg-[#C7A46A]/15 border border-[#C7A46A]/40 text-[#C7A46A] hover:bg-[#C7A46A] hover:text-[#191919] transition-all shrink-0 text-xs font-semibold shadow-sm"
                            title="Download APK"
                            aria-label="Download APK"
                          >
                            <Download size={14} />
                            <span>APK</span>
                          </motion.a>
                        )}

                        {p.demo && (
                          <motion.a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3.5 h-9 flex items-center gap-1.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] hover:text-[#C7A46A] hover:border-[#C7A46A]/50 transition-colors shrink-0 text-xs font-semibold shadow-sm"
                            title="Live Demo"
                            aria-label="Live Demo"
                          >
                            <span>Live Demo</span>
                            <ExternalLink size={13} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] hidden sm:flex shadow-2xl cursor-pointer"
          aria-label="Previous projects"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] hidden sm:flex shadow-2xl cursor-pointer"
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
