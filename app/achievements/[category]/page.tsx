"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  ExternalLink,
  ImageIcon,
  ZoomIn,
  X,
  FileText,
  Trophy,
  Award,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";
import Footer from "@/components/Footer";
import CertificateModal, { CertificateModalData } from "@/components/CertificateModal";
import { parseGoogleDriveUrl, resolveDisplayImageUrl } from "@/lib/google-drive";
import type { AchievementEntry } from "@/lib/portfolio-data";

interface LegacyFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf";
}

const CATEGORY_NAMES: Record<string, string> = {
  intercollege: "Inter-College Wins",
  hackathon: "Hackathon Prizes",
  events: "College Wins",
  participations: "Event Participations",
};

export default function AchievementGallery() {
  const params = useParams();
  const category = (params.category as string) || "intercollege";
  const [entries, setEntries] = useState<AchievementEntry[]>([]);
  const [legacyFiles, setLegacyFiles] = useState<LegacyFile[]>([]);
  const [categoryOverview, setCategoryOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        setLoading(true);
        const foundEntries: AchievementEntry[] = [];

        // Fetch from Portfolio published / draft data
        try {
          const res = await fetch("/api/portfolio-data");
          if (res.ok) {
            const json = await res.json();
            const achievements = json.data?.achievements || [];
            const currentCat = achievements.find(
              (ach: any) => ach.category === category || ach.id === category
            );

            if (currentCat) {
              setCategoryOverview(currentCat);
              if (Array.isArray(currentCat.entries)) {
                foundEntries.push(...currentCat.entries);
              }
            }
          }
        } catch (dataErr) {
          console.warn("Portfolio data fetch error:", dataErr);
        }

        setEntries(foundEntries);
        setLegacyFiles([]);
      } catch (err) {
        console.error("Error fetching category entries:", err);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchCategoryData();
    }
  }, [category]);

  const handleOpenCertificate = (title: string, fileUrl?: string, issuer?: string, description?: string) => {
    if (!fileUrl) return;

    // Check if direct image
    if (/\.(jpeg|jpg|png|webp|svg|gif)(\?.*)?$/i.test(fileUrl)) {
      setSelectedImage(fileUrl);
      return;
    }

    // Google Drive or PDF or Uploaded doc
    setSelectedCert({
      title,
      issuer: issuer || CATEGORY_NAMES[category] || "Achievement Certificate",
      description: description || "",
      file_url: fileUrl,
    });
  };

  const categoryTitle = CATEGORY_NAMES[category] || categoryOverview?.title || "Achievements";
  const hasContent = entries.length > 0 || legacyFiles.length > 0;

  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F4F0E8]">
      <StarsBg />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <Link
          href="/#achievements"
          className="inline-flex items-center gap-2 text-[#C7A46A] hover:text-[#D8BC8A] text-xs sm:text-sm font-semibold transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Achievements
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 text-[#C7A46A] text-xs font-bold tracking-[0.25em] uppercase mb-2">
            <Trophy size={16} />
            <span>— VERIFIED ACHIEVEMENTS —</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 font-heading tracking-tight">
            {categoryTitle} <span className="text-[#C7A46A]">Collection</span>
          </h1>
          <p className="text-[#A7A198] text-sm sm:text-base max-w-2xl leading-relaxed">
            {categoryOverview?.description ||
              `A verified collection of competition awards, placements, and certificates under ${categoryTitle}.`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C7A46A] animate-spin mb-4" />
            <p className="text-[#A7A198] text-sm animate-pulse">Loading achievements...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. Verified Competition Entries */}
            {entries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry, idx) => {
                  const certUrl = entry.certificate_url || entry.proof_document || entry.image;
                  const gdrive = certUrl ? parseGoogleDriveUrl(certUrl) : null;
                  const displayThumb = entry.image
                    ? resolveDisplayImageUrl(entry.image)
                    : gdrive?.isGoogleDrive
                    ? gdrive.thumbnailUrl || gdrive.directImageUrl
                    : null;

                  return (
                    <motion.div
                      key={entry.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-[#151517] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 flex flex-col justify-between shadow-xl group"
                    >
                      <div>
                        {/* Top row: Badge and Date */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center p-2.5 shrink-0">
                            <Award size={20} />
                          </div>
                          {entry.position_award && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A]">
                              {entry.position_award}
                            </span>
                          )}
                        </div>

                        {/* Title & Organization / Date */}
                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#F4F0E8] mb-1.5 leading-snug">
                          {entry.title}
                        </h3>
                        {entry.event_name && (
                          <p className="text-xs font-semibold text-[#C7A46A] mb-1">
                            {entry.event_name}
                          </p>
                        )}
                        {entry.date && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A7A198]/80 mb-3">
                            <Calendar size={12} />
                            <span>{entry.date}</span>
                          </div>
                        )}

                        {/* Thumbnail preview if available */}
                        {displayThumb && (
                          <div
                            onClick={() => handleOpenCertificate(entry.title, certUrl, categoryTitle, entry.description)}
                            className="relative h-44 w-full mb-4 rounded-xl overflow-hidden bg-[#202023] border border-[#302D28] cursor-zoom-in group/img"
                          >
                            <img
                              src={displayThumb}
                              alt={entry.title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-[#0B0B0C]/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="text-[#F4F0E8] w-6 h-6" />
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-[#A7A198] text-xs sm:text-sm leading-relaxed mb-6">
                          {entry.description}
                        </p>
                      </div>

                      {/* View Certificate Button */}
                      {certUrl ? (
                        <div className="pt-3 border-t border-[#302D28] mt-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenCertificate(entry.title, certUrl, categoryTitle, entry.description)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] text-xs sm:text-sm font-semibold hover:bg-[#C7A46A] hover:text-[#151517] hover:border-[#C7A46A] transition-all duration-200 shadow-sm"
                          >
                            <ExternalLink size={14} />
                            <span>View Certificate & Proof</span>
                          </button>
                        </div>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 2. Legacy Uploaded Files (if any) */}
            {legacyFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A7A198] mb-4">
                  Additional Proof Files
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {legacyFiles.map((file, i) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="bg-[#151517] rounded-2xl overflow-hidden group border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 flex flex-col shadow-xl"
                    >
                      <div
                        className="relative h-44 w-full bg-[#202023] cursor-zoom-in overflow-hidden"
                        onClick={() => handleOpenCertificate(file.name, file.url, categoryTitle)}
                      >
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#A7A198] group-hover:text-[#C7A46A] transition-colors">
                            <FileText size={40} className="mb-2 opacity-50 group-hover:opacity-100" />
                            <span className="text-xs font-semibold">PDF Document</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        <p className="text-xs font-medium text-[#F4F0E8] truncate" title={file.name}>
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenCertificate(file.name, file.url, categoryTitle)}
                          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] text-xs font-semibold hover:bg-[#C7A46A] hover:text-[#151517] transition-all"
                        >
                          <ExternalLink size={13} />
                          View Certificate
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasContent && (
              <div className="text-center py-20 px-6 bg-[#151517] rounded-3xl border border-dashed border-[#302D28] max-w-xl mx-auto">
                <ImageIcon size={48} className="mx-auto mb-4 text-[#C7A46A] opacity-40" />
                <h3 className="text-lg font-bold font-heading text-[#F4F0E8] mb-2">
                  No Entries Added Yet
                </h3>
                <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed mb-6">
                  Entries added to this category in the Admin Dashboard will appear here along with verified certificates and Google Drive proof.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                >
                  <Sparkles size={14} />
                  Manage in Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#0B0B0C]/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full h-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-12 right-0 text-[#A7A198] hover:text-[#C7A46A] transition-colors p-2"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                <X size={28} />
              </button>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#302D28] bg-[#151517] flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Achievement Proof"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Certificate Lightbox Modal (for PDFs and Google Drive documents) */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Footer />
    </main>
  );
}
