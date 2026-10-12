"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Zap, ArrowRight, X, Medal, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SectionDivider from "./SectionDivider";
import { Achievement } from "@/lib/portfolio-data";

const ICON_MAP: Record<string, any> = {
  Trophy,
  Award,
  Zap,
  Medal,
  Sparkles,
  Star,
};

function resolveAchievementIcon(icon: any) {
  if (typeof icon === "string") {
    return ICON_MAP[icon] || Trophy;
  }
  return icon || Trophy;
}

const defaultAchievements = [
  {
    icon: Trophy,
    title: "Inter-College Wins",
    highlight: "🏆 5+ Wins",
    subtitle: "Various Institutions",
    category: "intercollege",
    description:
      "Successfully competed and secured top positions in symposiums and technical fests held at various reputed colleges.",
  },
  {
    icon: Award,
    title: "College Wins",
    highlight: "🏆 5+ Wins",
    subtitle: "PSG CAS (Internal)",
    category: "events",
    description:
      "Consistent performance in intra-college events, spanning debugging, logic-building, and technical paper presentations.",
  },
  {
    icon: Zap,
    title: "Hackathon Prizes",
    subtitle: "Innovation & Coding",
    category: "hackathon",
    description:
      "Building functional prototypes and solving real-world problems under pressure. Secured multiple podium finishes.",
  },
  {
    icon: Award,
    title: "Event Participations",
    highlight: "📜 Participations",
    subtitle: "Inside & Outside College",
    category: "participations",
    description:
      "Active participation across technical symposiums, workshops, coding contests, and conferences spanning multiple institutions.",
  },
];

interface AchievementsProps {
  data?: Achievement[];
}

export default function Achievements({ data }: AchievementsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const items = data && data.length > 0 ? data : defaultAchievements;

  return (
    <section id="achievements" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2.5 font-heading">
            — MY JOURNEY —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Achievements
          </h2>
        </motion.div>

        {/* Balanced Cards Grid */}
        <div className={`grid ${items.length <= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"} gap-5 lg:gap-6 mx-auto`}>
          {items.map((item: any, i: number) => {
            const Icon = resolveAchievementIcon(item.icon);
            const entryCount = Array.isArray(item.entries) ? item.entries.length : 0;
            const badge = entryCount > 0 ? `🏆 ${entryCount} ${entryCount === 1 ? 'Win' : 'Wins'}` : (item.highlight || item.position_award);
            const subtitleText = item.subtitle || item.event_name;
            const targetCategory = item.category || "intercollege";

            return (
              <motion.div
                key={item.id || item.title || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#151517] relative rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 w-full cursor-default flex flex-col justify-between overflow-hidden border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 shadow-xl"
              >
                <div className="flex flex-col flex-grow">
                  {/* Top row: Icon + Highlight Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#202023] border border-[#302D28] text-[#C7A46A] shadow-inner p-3">
                      <Icon size={22} />
                    </div>
                    {badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A] shrink-0">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-3">
                    <h3 className="text-[#F4F0E8] font-bold text-base sm:text-lg leading-snug font-heading">
                      {item.title}
                    </h3>
                    {subtitleText && (
                      <p className="text-xs sm:text-sm font-medium text-[#C7A46A] mt-0.5">
                        {subtitleText}
                      </p>
                    )}
                    {item.date && (
                      <p className="text-[11px] text-[#A7A198]/80 mt-0.5">
                        {item.date}
                      </p>
                    )}
                  </div>

                  {/* Optional Image Thumbnail */}
                  {item.image && (
                    <div
                      className="relative h-36 w-full mb-4 rounded-xl overflow-hidden bg-[#202023] border border-[#302D28] cursor-pointer group/thumb"
                      onClick={() => setSelectedImage(item.image)}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                    {item.description}
                  </p>
                </div>

                {/* Button */}
                <div className="w-full mt-auto pt-2 flex flex-col gap-2">
                  {item.image ? (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(item.image)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#302D28] bg-[#202023] text-[#F4F0E8] hover:bg-[#C7A46A]/15 hover:border-[#C7A46A]/50 hover:text-[#C7A46A] text-xs sm:text-sm font-semibold transition-all duration-200"
                    >
                      View Photo / Proof
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <Link href={`/achievements/${targetCategory}`} className="w-full block">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#302D28] bg-[#202023] text-[#F4F0E8] hover:bg-[#C7A46A]/15 hover:border-[#C7A46A]/50 hover:text-[#C7A46A] text-xs sm:text-sm font-semibold transition-all duration-200"
                      >
                        <span>{entryCount > 0 ? `View Certificates (${entryCount})` : "View Certificates"}</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#0B0B0C]/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full h-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-[#A7A198] hover:text-[#C7A46A] transition-colors"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                <X size={32} />
              </button>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#302D28] bg-[#151517]">
                <Image
                  src={selectedImage}
                  alt="Achievement Full"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SectionDivider />
    </section>
  );
}
