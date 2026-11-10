"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Code2, Layout, Server, Database, Smartphone, Wrench, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";
import Footer from "@/components/Footer";
import { ALL_SKILLS_CATEGORIES } from "@/lib/skills-data";

const CATEGORY_ICONS: Record<string, any> = {
  Code2,
  Layout,
  Server,
  Database,
  Smartphone,
  Wrench,
  Sparkles,
};

function resolveCategoryIcon(iconName: string) {
  return CATEGORY_ICONS[iconName] || Code2;
}

export default function AllSkillsPage() {
  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F4F0E8]">
      <StarsBg />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 relative z-10">
        {/* Top-Left: Back to Home button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151517] border border-[#302D28] text-[#C7A46A] hover:border-[#C7A46A]/50 hover:bg-[#C7A46A]/10 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 group w-fit"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Centered Heading (Compact & Clean, no subtitles or paragraphs) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-7 sm:mb-9"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C7A46A]" />
            <span className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase font-heading">
              MY EXPERTISE
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C7A46A]" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            ALL SKILLS
          </h1>
        </motion.div>

        {/* Category Grid: 2 columns on desktop, AI Tools spans full width at the bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
          {ALL_SKILLS_CATEGORIES.map((category, index) => {
            const Icon = resolveCategoryIcon(category.icon);
            const isAiTools = category.id === "ai-tools";

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`rounded-2xl p-4 sm:p-5 lg:p-6 bg-[#111114]/90 border border-[#2B2824] hover:border-[#C7A46A]/35 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                  isAiTools ? "lg:col-span-2" : ""
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#262420]/70">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#18181C] border border-[#2B2824] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                      <Icon size={17} />
                    </div>
                    <h2 className="text-base sm:text-lg lg:text-[21px] font-bold text-[#F4F0E8] font-heading tracking-tight">
                      {category.title}
                    </h2>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/20 shrink-0">
                    {category.skills.length} {isAiTools ? "Tools" : "Skills"}
                  </span>
                </div>

                {/* Individual Skill Tiles */}
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {category.skills.map((skill) => (
                    <div
                      key={`${category.id}-${skill.name}`}
                      className="w-[82px] sm:w-[90px] h-[86px] sm:h-[94px] flex flex-col items-center justify-center p-2 rounded-xl bg-[#151518]/90 border border-[#2B2824] hover:border-[#C7A46A]/45 hover:bg-[#1B1B20] hover:-translate-y-0.5 transition-all duration-200 group cursor-default select-none shadow-sm shrink-0"
                    >
                      {/* Logo */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center mb-1.5 transition-transform duration-200 group-hover:scale-105 shrink-0">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={34}
                          height={34}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      {/* Name below logo */}
                      <span className="text-[11px] sm:text-[12.5px] font-medium text-[#E4DFD5] text-center tracking-tight leading-tight group-hover:text-[#C7A46A] transition-colors truncate max-w-full px-1">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
