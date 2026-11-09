"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code2,
  Layout,
  Database,
  Smartphone,
  Brain,
  Sparkles,
  Terminal,
  Cpu,
  Globe,
  Server,
  Wrench,
  Layers,
  FileCode,
  Binary,
  Bot,
  Workflow,
  Sparkle,
} from "lucide-react";
import SectionDivider from "./SectionDivider";
import { SkillCategory } from "@/lib/portfolio-data";

// Category Icons
const CATEGORY_ICON_MAP: Record<string, any> = {
  Code2,
  Layout,
  Database,
  Smartphone,
  Brain,
  Sparkles,
  Terminal,
  Cpu,
  Globe,
  Server,
  Wrench,
  Layers,
};

function resolveCategoryIcon(icon: any) {
  if (typeof icon === "string") {
    return CATEGORY_ICON_MAP[icon] || Code2;
  }
  return icon || Code2;
}

// Individual Skill Icons Map for realistic, domain-specific visual polish
const SKILL_ICON_MAP: Record<string, any> = {
  // Programming
  C: Terminal,
  "C++": Binary,
  Python: FileCode,
  Java: Code2,

  // Frontend
  HTML: Globe,
  CSS: Layout,
  JavaScript: FileCode,
  React: Layers,
  "Next.js": Globe,
  "Tailwind CSS": Layout,

  // Backend & Database
  "Node.js": Server,
  SQL: Database,
  Supabase: Database,
  "File Handling": Terminal,

  // Application Development
  Flutter: Smartphone,
  Kotlin: Cpu,

  // Core Competencies
  "Problem Solving": Brain,
  "Data Structures": Workflow,
  Algorithms: Binary,
  Debugging: Wrench,

  // AI Tools
  Claude: Bot,
  ChatGPT: Bot,
  Codex: Code2,
  Gamma: Sparkles,
  ElevenLabs: Cpu,
  Antigravity: Sparkles,
  NotebookLM: Brain,
  "Napkin AI": Layout,
};

function resolveSkillIcon(skillName: string, categoryIcon: any) {
  return SKILL_ICON_MAP[skillName] || categoryIcon || Sparkle;
}

const defaultSkillCategories: SkillCategory[] = [
  {
    id: "cat-1",
    num: "01",
    title: "Programming",
    icon: "Code2",
    skills: ["C", "C++", "Python", "Java"],
  },
  {
    id: "cat-2",
    num: "02",
    title: "Frontend",
    icon: "Layout",
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "cat-3",
    num: "03",
    title: "Backend & Database",
    icon: "Database",
    skills: ["Node.js", "SQL", "Supabase", "File Handling"],
  },
  {
    id: "cat-4",
    num: "04",
    title: "Application Development",
    icon: "Smartphone",
    skills: ["Flutter", "Kotlin", "Java"],
  },
  {
    id: "cat-5",
    num: "05",
    title: "Core Competencies",
    icon: "Brain",
    skills: ["Problem Solving", "Data Structures", "Algorithms", "AI Tools", "Debugging"],
  },
  {
    id: "cat-6",
    num: "06",
    title: "AI Tools",
    icon: "Sparkles",
    skills: ["Claude", "ChatGPT", "Codex", "Gamma", "ElevenLabs", "Antigravity", "NotebookLM", "Napkin AI"],
  },
];

interface SkillsProps {
  data?: SkillCategory[];
}

export default function Skills({ data }: SkillsProps) {
  const categories = data && data.length > 0 ? data : defaultSkillCategories;
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const shouldReduceMotion = useReducedMotion();

  // Compute total skills count across all categories
  const totalSkillsCount = categories.reduce((acc, cat) => acc + cat.skills.length, 0);

  // Filter skills according to selected category
  const activeCategory = categories.find(
    (c) => (c.id && c.id === activeCategoryId) || c.title === activeCategoryId
  );

  return (
    <section id="skills" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with subtle entrance */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2.5 font-heading">
            — MY EXPERTISE —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight mb-3">
            Technical Skills
          </h2>
          <p className="text-xs sm:text-sm text-[#A7A198] max-w-xl mx-auto font-sans leading-relaxed">
            Technologies, frameworks, and engineering tools I leverage to build scalable software.
          </p>
        </motion.div>

        {/* 1. Interactive Category Navigation Bar */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8 md:mb-10 max-w-5xl mx-auto"
        >
          {/* "All Skills" Tab */}
          <button
            onClick={() => setActiveCategoryId("all")}
            className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none ${
              activeCategoryId === "all"
                ? "bg-[#C7A46A]/15 text-[#C7A46A] border-[#C7A46A]/50 shadow-[0_0_20px_rgba(199,164,106,0.12)]"
                : "bg-[#151517] text-[#A7A198] border-[#302D28] hover:text-[#F4F0E8] hover:border-[#C7A46A]/30"
            }`}
          >
            <Sparkles size={14} className={activeCategoryId === "all" ? "text-[#C7A46A]" : "text-[#A7A198]"} />
            <span>All Skills</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeCategoryId === "all"
                  ? "bg-[#C7A46A]/25 text-[#C7A46A]"
                  : "bg-[#202023] text-[#A7A198]"
              }`}
            >
              {totalSkillsCount}
            </span>
          </button>

          {/* Individual Category Tabs */}
          {categories.map((cat, idx) => {
            const Icon = resolveCategoryIcon(cat.icon);
            const isCatActive = activeCategoryId === cat.id || activeCategoryId === cat.title;

            return (
              <button
                key={cat.id || cat.title || idx}
                onClick={() => setActiveCategoryId(cat.id || cat.title)}
                className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none ${
                  isCatActive
                    ? "bg-[#C7A46A]/15 text-[#C7A46A] border-[#C7A46A]/50 shadow-[0_0_20px_rgba(199,164,106,0.12)]"
                    : "bg-[#151517] text-[#A7A198] border-[#302D28] hover:text-[#F4F0E8] hover:border-[#C7A46A]/30"
                }`}
              >
                <Icon size={14} className={isCatActive ? "text-[#C7A46A]" : "text-[#A7A198]"} />
                <span>{cat.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isCatActive
                      ? "bg-[#C7A46A]/25 text-[#C7A46A]"
                      : "bg-[#202023] text-[#A7A198]"
                  }`}
                >
                  {cat.skills.length}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* 2. Interactive Skills Showcase Container */}
        <div className="max-w-5xl mx-auto min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeCategoryId === "all" ? (
              /* VIEW: All Categories Grouped */
              <motion.div
                key="all-categories"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-8"
              >
                {categories.map((cat, catIdx) => {
                  const CatIcon = resolveCategoryIcon(cat.icon);
                  const numDisplay = cat.num || String(catIdx + 1).padStart(2, "0");

                  return (
                    <div
                      key={cat.id || cat.title}
                      className="bg-[#141416]/90 border border-[#302D28] rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-xl"
                    >
                      {/* Category Header Row */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#302D28]/70">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-semibold text-[#C7A46A] tracking-wider">
                            {numDisplay}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                            <CatIcon size={16} />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#F4F0E8] font-heading">
                            {cat.title}
                          </h3>
                        </div>

                        <span className="text-xs font-mono text-[#A7A198]/80 bg-[#1E1E22] px-2.5 py-1 rounded-lg border border-[#302D28]">
                          {cat.skills.length} skills
                        </span>
                      </div>

                      {/* Skills Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {cat.skills.map((skill, sIdx) => {
                          const SkillIcon = resolveSkillIcon(skill, CatIcon);

                          return (
                            <motion.div
                              key={skill}
                              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.2,
                                delay: shouldReduceMotion ? 0 : sIdx * 0.02,
                              }}
                              whileHover={{ y: -2 }}
                              className="group flex items-center gap-2.5 p-3 rounded-xl bg-[#1A1A1E] border border-[#302D28] hover:border-[#C7A46A]/50 hover:bg-[#202025] transition-all duration-200 cursor-default select-none shadow-sm hover:shadow-[0_4px_15px_rgba(199,164,106,0.08)]"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#242429] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <SkillIcon size={14} />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-[#F4F0E8] group-hover:text-white transition-colors truncate">
                                {skill}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : activeCategory ? (
              /* VIEW: Single Selected Category Isolated with Fluid Animation */
              <motion.div
                key={activeCategory.id || activeCategory.title}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-[#141416]/90 border border-[#302D28] rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-xl"
              >
                {/* Category Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#302D28]/70 gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="text-xs font-mono font-semibold text-[#C7A46A] tracking-wider">
                      {activeCategory.num || "01"}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                      {(() => {
                        const Icon = resolveCategoryIcon(activeCategory.icon);
                        return <Icon size={20} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#F4F0E8] font-heading">
                        {activeCategory.title}
                      </h3>
                      <p className="text-xs text-[#A7A198] mt-0.5">
                        Focused technical capabilities and tooling
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center text-xs font-mono text-[#C7A46A] bg-[#C7A46A]/10 border border-[#C7A46A]/30 px-3 py-1.5 rounded-full font-semibold">
                    {activeCategory.skills.length} Technologies
                  </span>
                </div>

                {/* Skill Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {activeCategory.skills.map((skill, sIdx) => {
                    const CatIcon = resolveCategoryIcon(activeCategory.icon);
                    const SkillIcon = resolveSkillIcon(skill, CatIcon);

                    return (
                      <motion.div
                        key={skill}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: shouldReduceMotion ? 0 : sIdx * 0.03,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -3, scale: 1.01 }}
                        className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#1A1A1E] border border-[#302D28] hover:border-[#C7A46A]/50 hover:bg-[#202025] transition-all duration-300 shadow-md hover:shadow-[0_8px_25px_rgba(199,164,106,0.1)] cursor-default select-none overflow-hidden"
                      >
                        {/* Top subtle highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C7A46A]/0 group-hover:via-[#C7A46A]/70 to-transparent transition-all duration-500" />

                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#242429] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner group-hover:border-[#C7A46A]/40">
                            <SkillIcon size={18} />
                          </div>

                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A7A198]/60 group-hover:text-[#C7A46A] transition-colors">
                            {activeCategory.title}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-[#F4F0E8] font-heading group-hover:text-white transition-colors leading-tight">
                            {skill}
                          </h4>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
