"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionDivider from "./SectionDivider";
import { DEVELOPMENT_SKILLS_TICKER, AI_TOOLS_TICKER } from "@/lib/skills-data";

interface SkillsProps {
  data?: any;
}

export default function Skills({ data }: SkillsProps) {
  // Triple the arrays to ensure a continuous, gap-free loop across any viewport width
  const devList = [...DEVELOPMENT_SKILLS_TICKER, ...DEVELOPMENT_SKILLS_TICKER, ...DEVELOPMENT_SKILLS_TICKER];
  const aiList = [...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER, ...AI_TOOLS_TICKER];

  return (
    <section id="skills" className="relative z-10 pt-10 md:pt-14 pb-0 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 font-heading">
            — MY EXPERTISE —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Skills
          </h2>
        </motion.div>

        {/* Dual Ticker Showcase */}
        <div className="relative flex flex-col space-y-5 sm:space-y-6">
          {/* Subtle edge fade overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#0B0B0C] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#0B0B0C] to-transparent z-10" />

          {/* Ticker 1: Development Skills (Moving Left to Right) */}
          <div className="overflow-hidden py-1 w-full group">
            <div className="flex w-max gap-4 sm:gap-5 items-center animate-ticker-right hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
              {devList.map((skill, index) => (
                <div
                  key={`dev-${skill.name}-${index}`}
                  className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-full bg-[#141416]/90 border border-[#302D28]/80 hover:border-[#C7A46A]/50 hover:bg-[#1A1A1E] transition-all duration-200 shadow-sm cursor-default select-none shrink-0"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={24}
                      height={24}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#F4F0E8] whitespace-nowrap tracking-wide font-sans">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticker 2: AI Tools (Moving Right to Left) */}
          <div className="overflow-hidden py-1 w-full group">
            <div className="flex w-max gap-4 sm:gap-5 items-center animate-ticker-left hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
              {aiList.map((tool, index) => (
                <div
                  key={`ai-${tool.name}-${index}`}
                  className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-full bg-[#141416]/90 border border-[#302D28]/80 hover:border-[#C7A46A]/50 hover:bg-[#1A1A1E] transition-all duration-200 shadow-sm cursor-default select-none shrink-0"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#F4F0E8] whitespace-nowrap tracking-wide font-sans">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common View All Skills Button */}
        <div className="flex justify-center mt-10 md:mt-12">
          <Link
            href="/skills"
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-[#C7A46A]/45 bg-[#C7A46A]/10 hover:bg-[#C7A46A] text-[#C7A46A] hover:text-[#0B0B0C] font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(199,164,106,0.12)] hover:shadow-[0_0_30px_rgba(199,164,106,0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View All Skills</span>
            <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
