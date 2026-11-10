"use client";

import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionDivider from "./SectionDivider";
import { DEVELOPMENT_SKILLS_TICKER, AI_TOOLS_TICKER } from "@/lib/skills-data";

interface SkillsProps {
  data?: any;
}

export default function Skills({ data }: SkillsProps) {
  // Multiply arrays to create an unbroken seamless ticker loop
  const devList = [
    ...DEVELOPMENT_SKILLS_TICKER,
    ...DEVELOPMENT_SKILLS_TICKER,
    ...DEVELOPMENT_SKILLS_TICKER,
    ...DEVELOPMENT_SKILLS_TICKER,
  ];

  const aiList = [
    ...AI_TOOLS_TICKER,
    ...AI_TOOLS_TICKER,
    ...AI_TOOLS_TICKER,
    ...AI_TOOLS_TICKER,
  ];

  return (
    <section id="skills" className="relative z-10 pt-10 md:pt-14 pb-0 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          {/* Top Line: MY EXPERTISE with flanking gold lines */}
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#C7A46A]" />
            <span className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase font-heading">
              MY EXPERTISE
            </span>
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#C7A46A]" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#F4F0E8] to-[#D8BC8A]">
            Skills
          </h2>
        </motion.div>

        {/* TWO Large, Wide, Premium Ticker Containers */}
        <div className="flex flex-col space-y-5 sm:space-y-6">
          {/* CONTAINER 1: Development Skills (Moving Left to Right) */}
          <div className="relative w-full rounded-2xl sm:rounded-full bg-[#0D0D10]/95 border border-[#C7A46A]/40 shadow-[0_0_25px_rgba(199,164,106,0.12)] backdrop-blur-md h-[88px] sm:h-[96px] flex items-center overflow-hidden">
            {/* FIXED LEFT SIDE */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 pl-4 sm:pl-6 pr-3 sm:pr-4 shrink-0 z-20 bg-[#0D0D10] h-full">
              {/* Golden code icon inside rounded square */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#141418] border border-[#2F2C27] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                <Code2 size={21} className="text-[#C7A46A]" />
              </div>

              {/* Heading */}
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-xs sm:text-sm font-bold text-[#F4F0E8] font-heading whitespace-nowrap">
                  Development
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F4F0E8] font-heading whitespace-nowrap">
                  Skills
                </span>
              </div>

              {/* Thin vertical separator */}
              <div className="w-[1px] h-8 sm:h-10 bg-[#2F2C27] shrink-0 ml-1 sm:ml-2" />
            </div>

            {/* RIGHT SIDE (Moving Ticker) */}
            <div className="relative flex-1 overflow-hidden h-full flex items-center">
              {/* Subtle edge fade masks */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#0D0D10] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#0D0D10] to-transparent z-10" />

              {/* Ticker Row */}
              <div className="flex w-max items-center animate-ticker-right hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {devList.map((skill, index) => (
                  <div key={`dev-${skill.name}-${index}`} className="flex items-center">
                    <div className="flex flex-col items-center justify-center group/item cursor-default select-none px-1">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex items-center justify-center mb-1">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={28}
                          height={28}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-[#F4F0E8] text-center whitespace-nowrap tracking-tight">
                        {skill.name}
                      </span>
                    </div>

                    {/* Small gold dot separator */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A] shadow-[0_0_6px_#C7A46A] shrink-0 mx-4 sm:mx-6" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTAINER 2: AI Tools (Moving Right to Left) */}
          <div className="relative w-full rounded-2xl sm:rounded-full bg-[#0D0D10]/95 border border-[#C7A46A]/40 shadow-[0_0_25px_rgba(199,164,106,0.12)] backdrop-blur-md h-[88px] sm:h-[96px] flex items-center overflow-hidden">
            {/* FIXED LEFT SIDE */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 pl-4 sm:pl-6 pr-3 sm:pr-4 shrink-0 z-20 bg-[#0D0D10] h-full">
              {/* Golden sparkles icon inside rounded square */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#141418] border border-[#2F2C27] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles size={21} className="text-[#C7A46A]" />
              </div>

              {/* Heading */}
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-bold text-[#F4F0E8] font-heading whitespace-nowrap">
                  AI Tools
                </span>
              </div>

              {/* Thin vertical separator */}
              <div className="w-[1px] h-8 sm:h-10 bg-[#2F2C27] shrink-0 ml-1 sm:ml-2" />
            </div>

            {/* RIGHT SIDE (Moving Ticker) */}
            <div className="relative flex-1 overflow-hidden h-full flex items-center">
              {/* Subtle edge fade masks */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#0D0D10] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#0D0D10] to-transparent z-10" />

              {/* Ticker Row */}
              <div className="flex w-max items-center animate-ticker-left hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
                {aiList.map((tool, index) => (
                  <div key={`ai-${tool.name}-${index}`} className="flex items-center">
                    <div className="flex flex-col items-center justify-center group/item cursor-default select-none px-1">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex items-center justify-center mb-1">
                        <Image
                          src={tool.icon}
                          alt={tool.name}
                          width={28}
                          height={28}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-[#F4F0E8] text-center whitespace-nowrap tracking-tight">
                        {tool.name}
                      </span>
                    </div>

                    {/* Small gold dot separator */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A] shadow-[0_0_6px_#C7A46A] shrink-0 mx-4 sm:mx-6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Common View All Skills Button flanked by gold gradient accent lines */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-10 md:mt-12">
          <div className="hidden sm:block h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#C7A46A]/60" />
          <Link
            href="/skills"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#C7A46A]/60 bg-[#0D0D10] hover:bg-[#C7A46A] text-[#C7A46A] hover:text-[#0B0B0C] font-heading font-semibold text-xs sm:text-sm tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(199,164,106,0.15)] hover:shadow-[0_0_30px_rgba(199,164,106,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View All Skills</span>
            <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
          <div className="hidden sm:block h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#C7A46A]/60" />
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
