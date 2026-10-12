"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, ExternalLink, ImageIcon, ZoomIn, X, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";
import Footer from "@/components/Footer";
import CertificateModal, { CertificateModalData } from "@/components/CertificateModal";

interface AchievementFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf";
}

const CATEGORY_NAMES: Record<string, string> = {
  intercollege: "Inter-College Wins",
  hackathon: "Hackathon Prizes",
  events: "College Wins (PSG CAS)",
  participations: "Event Participations",
};

export default function AchievementGallery() {
  const params = useParams();
  const category = params.category as string;
  const [files, setFiles] = useState<AchievementFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const foundFiles: AchievementFile[] = [];

        // 1. Fetch from Supabase storage bucket (if files exist there)
        try {
          const { data, error } = await supabase.storage
            .from("achievements")
            .list(category);

          if (!error && data && data.length > 0) {
            data.forEach((file) => {
              const isPdf = file.name.toLowerCase().endsWith(".pdf");
              const { data: urlData } = supabase.storage
                .from("achievements")
                .getPublicUrl(`${category}/${file.name}`);

              foundFiles.push({
                id: file.id || file.name,
                name: file.name,
                url: urlData.publicUrl,
                type: isPdf ? ("pdf" as const) : ("image" as const),
              });
            });
          }
        } catch (supaErr) {
          console.warn("Supabase bucket fetch skipped:", supaErr);
        }

        // 2. Fetch from Portfolio published data
        try {
          const res = await fetch("/api/portfolio-data");
          if (res.ok) {
            const json = await res.json();
            const achievements = json.data?.achievements || [];
            achievements.forEach((ach: any) => {
              if (ach.category === category) {
                const targetUrl = ach.proof_document || ach.image;
                if (targetUrl) {
                  const isPdf = targetUrl.toLowerCase().includes(".pdf");
                  // Avoid duplicates
                  if (!foundFiles.some((f) => f.url === targetUrl)) {
                    foundFiles.push({
                      id: ach.id,
                      name: `${ach.title} — ${ach.event_name || ach.position_award || "Certificate"}`,
                      url: targetUrl,
                      type: isPdf ? ("pdf" as const) : ("image" as const),
                    });
                  }
                }
              }
            });
          }
        } catch (dataErr) {
          console.warn("Portfolio data fetch skipped:", dataErr);
        }

        setFiles(foundFiles);
      } catch (err) {
        console.error("Error fetching achievement files:", err);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchFiles();
    }
  }, [category]);

  const handleView = (file: AchievementFile) => {
    if (file.type === "image") {
      setSelectedImage(file.url);
    } else {
      setSelectedCert({
        title: file.name,
        issuer: CATEGORY_NAMES[category] || "Achievement Certificate",
        file_url: file.url,
      });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F4F0E8]">
      <StarsBg />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <Link 
          href="/#achievements"
          className="inline-flex items-center gap-2 text-[#C7A46A] hover:text-[#D8BC8A] text-sm font-medium transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Achievements
        </Link>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-heading tracking-tight">
            {CATEGORY_NAMES[category] || "Achievements"} <span className="text-[#C7A46A]">Gallery</span>
          </h1>
          <p className="text-[#A7A198] text-base sm:text-lg max-w-2xl">
            A verified collection of certificates, awards, and captures from {CATEGORY_NAMES[category]?.toLowerCase() || "this category"}.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C7A46A] animate-spin mb-4" />
            <p className="text-[#A7A198] text-sm animate-pulse">Loading certificates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-[#151517] rounded-2xl overflow-hidden group border border-[#302D28] hover:border-[#C7A46A]/40 transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Preview Area */}
                <div 
                  className="relative h-56 w-full bg-[#202023] cursor-zoom-in overflow-hidden"
                  onClick={() => handleView(file)}
                >
                  {file.type === "image" ? (
                    <>
                      <Image 
                        src={file.url} 
                        alt={file.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0B0B0C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="text-[#F4F0E8] w-7 h-7" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#A7A198] group-hover:text-[#C7A46A] transition-colors">
                      <FileText size={44} className="mb-3 opacity-40 group-hover:opacity-100" />
                      <span className="text-xs font-medium">PDF Certificate</span>
                    </div>
                  )}
                </div>

                {/* Info & Button */}
                <div className="p-5 flex flex-col gap-4">
                  <p className="text-xs sm:text-sm font-medium text-[#F4F0E8] truncate" title={file.name}>
                    {file.name}
                  </p>
                  
                  <button
                    onClick={() => handleView(file)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] text-xs sm:text-sm font-semibold hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] transition-all duration-300"
                  >
                    <ExternalLink size={14} />
                    View Certificate
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && files.length === 0 && (
          <div className="text-center py-20 bg-[#151517] rounded-3xl border border-dashed border-[#302D28]">
            <ImageIcon size={44} className="mx-auto mb-4 text-[#A7A198] opacity-30" />
            <p className="text-[#A7A198] text-sm italic">No files found for this category yet.</p>
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
                className="absolute -top-12 right-0 text-[#A7A198] hover:text-[#C7A46A] transition-colors"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                <X size={32} />
              </button>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#302D28] bg-[#151517]">
                <Image
                  src={selectedImage}
                  alt="Full Achievement"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Certificate Lightbox Modal for PDFs */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Footer />
    </main>
  );
}
