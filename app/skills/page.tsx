"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Code2, Layout, Server, Database, Smartphone, Wrench, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";
import Footer from "@/components/Footer";
import { ALL_SKILLS_CATEGORIES, SkillCategoryGroup } from "@/lib/skills-data";

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
  const IconComponent = CATEGORY_ICONS[iconName] || Code2;
  return IconComponent;
}

export default function AllSkillsPage() {
  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F4F0E8]">
      <StarsBg />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 relative z-10">
        {/* Top-Left: Back to Home button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#151517] border border-[#302D28] text-[#C7A46A] hover:border-[#C7A46A]/50 hover:bg-[#C7A46A]/10 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Centered Heading (Spacious & Clean, no subtitle) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 font-heading">
            — MY EXPERTISE —
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            ALL SKILLS
          </h1>
        </motion.div>

        {/* Category Grid: 2 columns on desktop, AI Tools spans full width at the bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {ALL_SKILLS_CATEGORIES.map((category, index) => {
            const Icon = resolveCategoryIcon(category.icon);
            const isAiTools = category.id === "ai-tools";

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`rounded-3xl p-6 sm:p-7 lg:p-8 bg-[#121214]/90 border border-[#C7A46A]/25 backdrop-blur-md shadow-[0_0_30px_rgba(199,164,106,0.06)] hover:border-[#C7A46A]/45 hover:shadow-[0_0_35px_rgba(199,164,106,0.12)] transition-all duration-300 relative ${
                  isAiTools ? "lg:col-span-2" : ""
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#302D28]/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C20] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#F4F0E8] font-heading tracking-tight">
                      {category.title}
                    </h2>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/25 shrink-0">
                    {category.skills.length} {isAiTools ? "Tools" : "Skills"}
                  </span>
                </div>

                {/* Individual Skill Tiles */}
                <div
                  className={`grid gap-3 sm:gap-4 ${
                    isAiTools
                      ? "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7"
                      : "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4"
                  }`}
                >
                  {category.skills.map((skill) => (
                    <div
                      key={`${category.id}-${skill.name}`}
                      className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-[#17171A]/90 border border-[#302D28] hover:border-[#C7A46A]/50 hover:bg-[#1E1E23] hover:-translate-y-1 transition-all duration-200 group cursor-default shadow-sm select-none"
                    >
                      {/* Logo with consistent size */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={36}
                          height={36}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      {/* Name below logo */}
                      <span className="text-xs font-semibold text-[#F4F0E8] text-center tracking-wide group-hover:text-[#C7A46A] transition-colors leading-tight">
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

