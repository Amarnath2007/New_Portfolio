"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Rocket, Users, Lightbulb, ExternalLink } from "lucide-react";
import Image from "next/image";
import SectionDivider from "./SectionDivider";

export default function Experience() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      id="experience"
      className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          {/* Creating Impact badge with flank horizontal lines */}
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C7A46A]" />
            <span className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-wider font-heading uppercase">
              Creating Impact
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C7A46A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            EXPERIENCE & LEADERSHIP
          </h2>
        </motion.div>

        {/* CONTAINER 1: My Startups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-[#121214]/90 border border-[#C7A46A]/35 shadow-[0_0_35px_rgba(199,164,106,0.12),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md mb-6 md:mb-8"
        >
          {/* Ambient corner highlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A46A]/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C7A46A]/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 lg:gap-7 items-stretch relative z-10">
            {/* Left Column: Startup Section Header */}
            <div className="flex flex-col justify-center space-y-3 pr-0 lg:pr-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C7A46A]/35 bg-[#C7A46A]/10 text-[#C7A46A] text-xs font-semibold tracking-wide w-fit">
                <Rocket size={13} className="text-[#C7A46A]" />
                <span>My Startups</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] font-heading tracking-tight leading-tight">
                Entrepreneurship<br className="hidden lg:inline" /> in Action
              </h3>

              <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed">
                Building scalable solutions to solve real-world problems.
              </p>
            </div>

            {/* Card 1: Averen Technologies */}
            <a
              href="https://averen.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#17171A]/95 border border-[#302D28] hover:border-purple-500/50 hover:shadow-[0_10px_35px_rgba(147,51,234,0.18)] transition-all duration-300 shadow-xl overflow-hidden cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Averen Logo */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#26123D] via-[#1E0F33] to-[#120820] border border-[#7C3AED]/40 flex items-center justify-center p-2.5 shrink-0 shadow-lg group-hover:border-[#8B5CF6]/70 transition-colors">
                      <Image
                        src="/averen-logo.png"
                        alt="Averen Technologies Logo"
                        width={52}
                        height={52}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Title & Role */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#F4F0E8] font-heading group-hover:text-white transition-colors leading-snug">
                        Averen Technologies
                      </h4>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C7A46A]/15 text-[#C7A46A] border border-[#C7A46A]/30">
                        Co-Founder
                      </span>
                    </div>
                  </div>

                  {/* External Link */}
                  <div className="p-1.5 rounded-lg text-[#A7A198] group-hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed group-hover:text-[#D1CBC3] transition-colors pb-6">
                  A technology venture focused on building modern, scalable digital solutions for businesses and institutions.
                </p>
              </div>

              {/* Bottom Subtle Purple Wave Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden rounded-b-2xl">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-gradient-to-t from-purple-600/35 via-violet-500/15 to-transparent blur-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
              </div>
            </a>

            {/* Card 2: ZipBi */}
            <a
              href="https://zipbi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#17171A]/95 border border-[#302D28] hover:border-[#C7A46A]/60 hover:shadow-[0_10px_35px_rgba(199,164,106,0.18)] transition-all duration-300 shadow-xl overflow-hidden cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* ZipBi Logo */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#0D0D0F] border border-[#302D28] flex items-center justify-center p-2 shrink-0 shadow-lg group-hover:border-[#C7A46A]/50 transition-colors">
                      <Image
                        src="/zipbi-logo.png"
                        alt="ZipBi Logo"
                        width={52}
                        height={52}
                        className="object-contain w-full h-full rounded-xl"
                      />
                    </div>

                    {/* Title & Role */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#F4F0E8] font-heading group-hover:text-white transition-colors leading-snug">
                        ZipBi
                      </h4>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C7A46A]/15 text-[#C7A46A] border border-[#C7A46A]/30">
                        Co-Founder
                      </span>
                    </div>
                  </div>

                  {/* External Link */}
                  <div className="p-1.5 rounded-lg text-[#A7A198] group-hover:text-[#C7A46A] transition-colors">
                    <ExternalLink size={16} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed group-hover:text-[#D1CBC3] transition-colors pb-6">
                  An AI-powered business operating system for local businesses, helping them digitize sales, inventory, and operations.
                </p>
              </div>

              {/* Bottom Subtle Gold Wave Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden rounded-b-2xl">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-gradient-to-t from-[#C7A46A]/35 via-[#D8BC8A]/15 to-transparent blur-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C7A46A]/70 to-transparent" />
              </div>
            </a>
          </div>
        </motion.div>

        {/* CONTAINER 2: Leadership & Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-[#121214]/90 border border-[#C7A46A]/35 shadow-[0_0_35px_rgba(199,164,106,0.12),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md"
        >
          {/* Ambient corner highlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A46A]/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C7A46A]/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-center relative z-10">
            {/* Left Column: Info */}
            <div className="flex flex-col justify-center space-y-3 pr-0 lg:pr-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C7A46A]/35 bg-[#C7A46A]/10 text-[#C7A46A] text-xs font-semibold tracking-wide w-fit">
                <Users size={13} className="text-[#C7A46A]" />
                <span>Leadership & Experience</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] font-heading tracking-tight leading-tight">
                Roles &<br className="hidden lg:inline" /> Responsibilities
              </h3>

              <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed">
                Representing, leading, and contributing to innovation and entrepreneurship across different platforms.
              </p>
            </div>

            {/* Right Side: Clean Perfectly Aligned Vertical Timeline */}
            <div className="relative pl-8 sm:pl-10">
              {/* Vertical Timeline Connecting Line directly behind all three dots */}
              <div className="absolute left-[16px] sm:left-[20px] top-[68px] md:top-[48px] bottom-[68px] md:bottom-[48px] w-[2px] bg-gradient-to-b from-[#C7A46A] via-[#C7A46A]/50 to-[#C7A46A] -translate-x-1/2 pointer-events-none" />

              <div className="flex flex-col space-y-4 md:space-y-5">
                {/* Role 1: Campus Ambassador */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.05, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative group"
                >
                  {/* Glowing Timeline Dot - centered precisely on the connecting line and card */}
                  <div className="absolute -left-8 sm:-left-10 w-8 sm:w-10 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#C7A46A] shadow-[0_0_10px_#C7A46A] ring-4 ring-[#C7A46A]/20" />
                  </div>

                  {/* 5-Column Grid Card */}
                  <div className="bg-[#17171A]/95 border border-[#302D28] hover:border-[#C7A46A]/40 rounded-2xl p-4 sm:p-5 md:py-0 md:px-5 lg:px-6 transition-all duration-300 shadow-lg min-h-[136px] md:h-[96px] grid grid-cols-[auto_1fr_auto] md:grid-cols-[44px_220px_1px_1fr_auto] lg:grid-cols-[44px_225px_1px_1fr_auto] items-center gap-x-3.5 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 gap-y-2.5 md:gap-y-0">
                    {/* Column 1: Icon */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#C7A46A]/40 transition-colors order-1 md:order-1 self-center">
                      <Rocket size={18} />
                    </div>

                    {/* Column 2: Role & Organization */}
                    <div className="flex flex-col justify-center min-w-0 pr-1 order-2 md:order-2 self-center">
                      <h4 className="text-sm sm:text-base font-bold text-[#F4F0E8] font-heading leading-tight truncate">
                        Campus Ambassador
                      </h4>
                      <p className="text-xs font-semibold text-[#C7A46A] mt-0.5 truncate">
                        E-Cell, IIT Bombay
                      </p>
                    </div>

                    {/* Column 3: Vertical Separator */}
                    <div className="hidden md:block w-[1px] h-9 bg-[#302D28]/80 justify-self-center order-3 md:order-3 self-center" />

                    {/* Column 4: Description */}
                    <p className="col-span-3 md:col-span-1 text-xs sm:text-sm text-[#A7A198] leading-relaxed order-4 md:order-4 self-center">
                      Representing IIT Bombay's entrepreneurship initiatives and connecting students with startup opportunities.
                    </p>

                    {/* Column 5: Date Badge */}
                    <div className="order-3 md:order-5 justify-self-end shrink-0 self-center">
                      <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A] whitespace-nowrap">
                        2026 – Present
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Role 2: Joint Secretary */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.15, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative group"
                >
                  {/* Glowing Timeline Dot - centered precisely on the connecting line and card */}
                  <div className="absolute -left-8 sm:-left-10 w-8 sm:w-10 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#C7A46A] shadow-[0_0_10px_#C7A46A] ring-4 ring-[#C7A46A]/20" />
                  </div>

                  {/* 5-Column Grid Card */}
                  <div className="bg-[#17171A]/95 border border-[#302D28] hover:border-[#C7A46A]/40 rounded-2xl p-4 sm:p-5 md:py-0 md:px-5 lg:px-6 transition-all duration-300 shadow-lg min-h-[136px] md:h-[96px] grid grid-cols-[auto_1fr_auto] md:grid-cols-[44px_220px_1px_1fr_auto] lg:grid-cols-[44px_225px_1px_1fr_auto] items-center gap-x-3.5 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 gap-y-2.5 md:gap-y-0">
                    {/* Column 1: Icon */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#C7A46A]/40 transition-colors order-1 md:order-1 self-center">
                      <Users size={18} />
                    </div>

                    {/* Column 2: Role & Organization */}
                    <div className="flex flex-col justify-center min-w-0 pr-1 order-2 md:order-2 self-center">
                      <h4 className="text-sm sm:text-base font-bold text-[#F4F0E8] font-heading leading-tight truncate">
                        Joint Secretary
                      </h4>
                      <p className="text-xs font-semibold text-[#C7A46A] mt-0.5 truncate">
                        E-Cell, PSG CAS
                      </p>
                    </div>

                    {/* Column 3: Vertical Separator */}
                    <div className="hidden md:block w-[1px] h-9 bg-[#302D28]/80 justify-self-center order-3 md:order-3 self-center" />

                    {/* Column 4: Description */}
                    <p className="col-span-3 md:col-span-1 text-xs sm:text-sm text-[#A7A198] leading-relaxed order-4 md:order-4 self-center">
                      Contributing to entrepreneurship initiatives, event planning and student community engagement.
                    </p>

                    {/* Column 5: Date Badge */}
                    <div className="order-3 md:order-5 justify-self-end shrink-0 self-center">
                      <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A] whitespace-nowrap">
                        2026 – Present
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Role 3: Innovation Ambassador */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative group"
                >
                  {/* Glowing Timeline Dot - centered precisely on the connecting line and card */}
                  <div className="absolute -left-8 sm:-left-10 w-8 sm:w-10 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#C7A46A] shadow-[0_0_10px_#C7A46A] ring-4 ring-[#C7A46A]/20" />
                  </div>

                  {/* 5-Column Grid Card */}
                  <div className="bg-[#17171A]/95 border border-[#302D28] hover:border-[#C7A46A]/40 rounded-2xl p-4 sm:p-5 md:py-0 md:px-5 lg:px-6 transition-all duration-300 shadow-lg min-h-[136px] md:h-[96px] grid grid-cols-[auto_1fr_auto] md:grid-cols-[44px_220px_1px_1fr_auto] lg:grid-cols-[44px_225px_1px_1fr_auto] items-center gap-x-3.5 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 gap-y-2.5 md:gap-y-0">
                    {/* Column 1: Icon */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#C7A46A]/40 transition-colors order-1 md:order-1 self-center">
                      <Lightbulb size={18} />
                    </div>

                    {/* Column 2: Role & Organization */}
                    <div className="flex flex-col justify-center min-w-0 pr-1 order-2 md:order-2 self-center">
                      <h4 className="text-sm sm:text-base font-bold text-[#F4F0E8] font-heading leading-tight truncate">
                        Innovation Ambassador
                      </h4>
                      <p className="text-xs font-semibold text-[#C7A46A] mt-0.5 truncate">
                        PSG CAS
                      </p>
                    </div>

                    {/* Column 3: Vertical Separator */}
                    <div className="hidden md:block w-[1px] h-9 bg-[#302D28]/80 justify-self-center order-3 md:order-3 self-center" />

                    {/* Column 4: Description */}
                    <p className="col-span-3 md:col-span-1 text-xs sm:text-sm text-[#A7A198] leading-relaxed order-4 md:order-4 self-center">
                      Promoting innovation, creative problem-solving and an entrepreneurial mindset among students.
                    </p>

                    {/* Column 5: Date Badge */}
                    <div className="order-3 md:order-5 justify-self-end shrink-0 self-center">
                      <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A] whitespace-nowrap">
                        2026 – Present
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SectionDivider />
    </section>
  );
}
