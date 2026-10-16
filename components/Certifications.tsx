"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import SectionDivider from "./SectionDivider";
import CertificateModal, { CertificateModalData } from "./CertificateModal";
import type { Certification } from "@/lib/portfolio-data";

const initialCerts = [
  {
    title: "HDCA Programming Certificate",
    issuer: "CSC (Computer Science Corporation)",
    fileName: "Hdca.pdf",
    description: "Comprehensive programming certification covering hardware and software fundamentals alongside core coding skills.",
  },
  {
    title: "Introduction to C",
    issuer: "NPTEL",
    fileName: "Nptel.pdf",
    description: "Officially certified by NPTEL, India's premier e-learning platform backed by IITs and IISc, covering C programming fundamentals.",
  },
  {
    title: "SEO for WordPress",
    issuer: "Udemy",
    fileName: "seo-udemy.pdf",
    description: "Completed training on search engine optimization techniques, web content strategy, and WordPress website management.",
  },
  {
    title: "AI Tools Workshop",
    issuer: "Be10x",
    fileName: "B10x.pdf",
    description: "Successfully completed an intensive workshop on AI tools, focusing on productivity enhancement and advanced generative AI workflows.",
  },
];

interface CertificationsProps {
  data?: Certification[];
}

export default function Certifications({ data }: CertificationsProps) {
  const [certs, setCerts] = useState<any[]>(data !== undefined ? data : initialCerts);
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  useEffect(() => {
    if (data !== undefined) {
      setCerts(data);
      return;
    }

    async function fetchCerts() {
      try {
        const res = await fetch("/api/portfolio-data");
        if (res.ok) {
          const json = await res.json();
          if (json.data?.certifications && json.data.certifications.length > 0) {
            setCerts(json.data.certifications);
            return;
          }
        }
        setCerts(initialCerts);
      } catch (err) {
        console.error("Error fetching homepage certs:", err);
        setCerts(initialCerts);
      }
    }
    fetchCerts();
  }, [data]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="certifications" className="relative z-10 pt-16 md:pt-20 pb-0 scroll-mt-24 md:scroll-mt-28">
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
            — MY CREDENTIALS —
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] font-heading tracking-tight">
            Certifications
          </h2>
        </motion.div>

        {/* Mobile View: Vertical Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:hidden">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-[#151517] rounded-2xl p-5 sm:p-7 group w-full flex flex-col justify-between border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col flex-grow">
                {/* Badge Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#202023] border border-[#302D28] text-[#C7A46A] shadow-inner p-3 shrink-0">
                  <BadgeCheck size={24} />
                </div>

                {/* Title & Issuer */}
                <h3 className="text-[#F4F0E8] font-bold text-base sm:text-lg mb-1 font-heading leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium mb-3 text-[#C7A46A]">
                  {cert.issuer}
                </p>

                {/* Description */}
                <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                  {cert.description}
                </p>
              </div>

              {/* Link / Open Modal Button */}
              <div className="pt-4 border-t border-[#302D28] mt-auto">
                <button 
                  id={`view-cert-mobile-${i}`}
                  type="button"
                  onClick={() => setSelectedCert(cert as any)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#A7A198] hover:text-[#C7A46A] font-medium transition-colors cursor-pointer text-left group/btn w-full"
                >
                  <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                  <span>View Certificate</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View: Horizontal Carousel */}
        <div className="hidden md:block relative group/carousel">
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-6 md:px-1 items-stretch [&::-webkit-scrollbar]:hidden" 
            style={{ scrollbarWidth: 'none' }}
          >
            {certs.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#151517] rounded-2xl md:rounded-3xl p-7 sm:p-8 group flex-shrink-0 w-[360px] flex flex-col justify-between border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Badge Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#202023] border border-[#302D28] text-[#C7A46A] shadow-inner p-3">
                    <BadgeCheck size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[#F4F0E8] font-bold text-base sm:text-lg mb-1 font-heading">{cert.title}</h3>
                  <p className="text-xs sm:text-sm font-medium mb-3.5 text-[#C7A46A]">
                    {cert.issuer}
                  </p>

                  {/* Description */}
                  <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6">{cert.description}</p>
                </div>

                {/* Link / Open Modal Button */}
                <div className="pt-4 border-t border-[#302D28]">
                  <button 
                    id={`view-cert-${i}`}
                    type="button"
                    onClick={() => setSelectedCert(cert as any)}
                    className="flex items-center gap-2 text-xs sm:text-sm text-[#A7A198] hover:text-[#C7A46A] font-medium transition-colors cursor-pointer text-left group/btn w-full"
                  >
                    <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] hidden sm:flex shadow-2xl"
            aria-label="Previous certificates"
          >
            <ChevronLeft size={22} />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-[#202023] border border-[#302D28] text-[#A7A198] flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-30 hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] flex shadow-2xl"
            aria-label="Next certificates"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Certificate Modal Lightbox */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <SectionDivider />
    </section>
  );
}
