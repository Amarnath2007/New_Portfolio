"use client";

import { motion } from "framer-motion";
import SectionDivider from "./SectionDivider";

const stats = [
  { value: "5+", label: "Projects Done" },
  { value: "5+", label: "Years in Tech" },
  { value: "15+", label: "Events Won" },
  { value: "5+", label: "Certifications" },
];

const details = [
  { label: "Name:", value: "Amarnath B" },
  { label: "Location:", value: "Coimbatore, Tamil Nadu" },
  { label: "Email:", value: "amarmicrosoft2021@gmail.com" },
  { label: "College:", value: "PSG CAS" },
  { label: "Availability:", value: "Open to Opportunities", highlight: true },
];

const tags = ["C", "C++", "Python", "Java", "Problem Solving", "AI Tools", "Debugging"];

export default function About() {
  return (
    <section id="about" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-20 md:scroll-mt-24">
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
            — WHO I AM —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            About
          </h2>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-[#151517] rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 border border-[#302D28] shadow-2xl items-center"
        >
          {/* Left Column */}
          <div className="text-center lg:text-left flex flex-col justify-between">
            <div>
              {/* Header inside */}
              <div className="mb-5">
                <p className="text-[#C7A46A] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-1 font-heading">
                  — ABOUT ME —
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] font-heading">
                  I&apos;m Amarnath
                </h3>
              </div>

              {/* Bio */}
              <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
                I&apos;m a BCA student at PSG CAS, Coimbatore — an enthusiastic coder
                passionate about competitive programming, hackathons, and tech
                innovation. With 15+ competition wins and a strong interest in AI
                tools, I combine creative thinking with technical execution to build
                impactful solutions.
              </p>

              {/* Currently Learning */}
              <div className="mb-6">
                <h4 className="text-[#F4F0E8] font-semibold text-xs sm:text-sm mb-2.5">Currently Learning 🚀</h4>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {["Full-stack development", "Advanced System Design"].map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.02 }}
                      className="px-3 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-[#F4F0E8] text-[11px] sm:text-xs font-medium cursor-default transition-all"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              {tags.map((t) => (
                <motion.span
                  key={t}
                  whileHover={{ scale: 1.02 }}
                  className="px-3 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#C7A46A] hover:border-[#C7A46A]/40 text-[11px] sm:text-xs font-medium cursor-default transition-all"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 justify-center">
            {/* Details */}
            <div className="space-y-3.5 bg-[#202023] p-5 sm:p-6 rounded-2xl border border-[#302D28]">
              {details.map((d) => (
                <div key={d.label} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 pb-2.5 sm:pb-0 border-b border-[#302D28]/60 sm:border-none last:border-none last:pb-0">
                  <span className="text-[#A7A198] text-xs sm:text-sm w-full sm:w-28 flex-shrink-0 font-medium">
                    {d.label}
                  </span>
                  <span
                    className={`text-xs sm:text-sm break-all ${d.highlight ? "text-[#C7A46A] font-semibold" : "text-[#F4F0E8] font-medium"
                      }`}
                  >
                    {d.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3.5 p-5 sm:p-6 rounded-2xl bg-[#0B0B0C] border border-[#302D28]">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center py-1.5"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#C7A46A] font-heading">
                    {s.value}
                  </div>
                  <div className="text-[#A7A198] text-[11px] sm:text-xs mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <SectionDivider />
    </section>
  );
}
