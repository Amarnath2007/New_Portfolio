"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Database, Smartphone, Brain, Sparkles } from "lucide-react";
import SectionDivider from "./SectionDivider";

const skillCategories = [
  {
    num: "01",
    title: "Programming",
    icon: Code2,
    skills: ["C", "C++", "Python", "Java"],
  },
  {
    num: "02",
    title: "Frontend",
    icon: Layout,
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    num: "03",
    title: "Backend & Database",
    icon: Database,
    skills: ["Node.js", "SQL", "Supabase", "File Handling"],
  },
  {
    num: "04",
    title: "Application Development",
    icon: Smartphone,
    skills: ["Flutter", "Kotlin", "Java"],
  },
  {
    num: "05",
    title: "Core Competencies",
    icon: Brain,
    skills: ["Problem Solving", "Data Structures", "Algorithms", "AI Tools", "Debugging"],
  },
  {
    num: "06",
    title: "AI Tools",
    icon: Sparkles,
    skills: ["Claude", "ChatGPT", "Codex", "Gamma", "ElevenLabs", "Antigravity", "NotebookLM", "Napkin AI"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 pt-6 md:pt-10 pb-0 scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with balanced top spacing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 font-heading">
            — MY EXPERTISE —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Skills
          </h2>
        </motion.div>

        {/* Structured Skills Panel with strictly aligned columns & uniform row heights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl lg:max-w-[1060px] mx-auto bg-[#151517] border border-[#302D28] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl divide-y divide-[#302D28]/70"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            const isAiTools = category.num === "06";

            return (
              <div
                key={category.num}
                className="flex flex-col md:grid md:grid-cols-[28px_36px_210px_1fr] lg:grid-cols-[32px_40px_230px_1fr] items-start md:items-center py-4 md:py-4.5 px-4 sm:px-6 lg:px-8 hover:bg-[#202023]/40 transition-colors duration-150 gap-3 md:gap-x-4 min-h-[76px] md:min-h-[82px]"
              >
                {/* Column 1: Number */}
                <div className="hidden md:flex items-center">
                  <span className="text-xs font-mono font-semibold text-[#C7A46A] tracking-wider">
                    {category.num}
                  </span>
                </div>

                {/* Column 2: Icon */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                    <Icon size={16} />
                  </div>
                </div>

                {/* Column 3: Category Name */}
                <div className="hidden md:flex items-center pr-2">
                  <h3 className="text-sm sm:text-base font-semibold text-[#F4F0E8] font-heading tracking-tight whitespace-nowrap">
                    {category.title}
                  </h3>
                </div>

                {/* Mobile Header (Columns 1, 2, 3 combined on mobile) */}
                <div className="flex md:hidden items-center gap-3 w-full">
                  <span className="text-xs font-mono font-semibold text-[#C7A46A] tracking-wider w-5 shrink-0">
                    {category.num}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                    <Icon size={15} />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#F4F0E8] font-heading tracking-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Column 4: Technology Badges (starts at the exact same column for all rows) */}
                <div className="w-full pl-8 md:pl-0 flex items-center">
                  {isAiTools ? (
                    /* AI Tools: 8 tools balanced across two clean lines of 4 tools each */
                    <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {category.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium bg-[#202023] text-[#F4F0E8] border border-[#302D28] hover:border-[#C7A46A]/50 hover:text-[#C7A46A] transition-all duration-200 cursor-default select-none shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {category.skills.slice(4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium bg-[#202023] text-[#F4F0E8] border border-[#302D28] hover:border-[#C7A46A]/50 hover:text-[#C7A46A] transition-all duration-200 cursor-default select-none shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Other categories: single row of wrapping badges starting at exact same column */
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium bg-[#202023] text-[#F4F0E8] border border-[#302D28] hover:border-[#C7A46A]/50 hover:text-[#C7A46A] transition-all duration-200 cursor-default select-none shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <SectionDivider />
    </section>
  );
}
