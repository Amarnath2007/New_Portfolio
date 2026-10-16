"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";
import Footer from "@/components/Footer";
import CertificateModal, { CertificateModalData } from "@/components/CertificateModal";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  file_url: string;
  category?: string;
}

const FALLBACK_CERTS = [
  {
    id: "1",
    title: "HDCA Programming Certificate",
    issuer: "CSC (Computer Science Corporation)",
    file_url: "",
    fileName: "Hdca.pdf",
  },
  {
    id: "2",
    title: "Introduction to C",
    issuer: "NPTEL",
    file_url: "",
    fileName: "Nptel.pdf",
  },
  {
    id: "3",
    title: "SEO for WordPress",
    issuer: "Udemy",
    file_url: "",
    fileName: "seo-udemy.pdf",
  },
  {
    id: "4",
    title: "AI Tools Workshop",
    issuer: "Be10x",
    file_url: "",
    fileName: "B10x.pdf",
  },
];

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch("/api/portfolio-data");
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.data?.certifications && Array.isArray(resJson.data.certifications)) {
            setCerts(resJson.data.certifications);
            return;
          }
        }
        setCerts(FALLBACK_CERTS);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setCerts(FALLBACK_CERTS);
      } finally {
        setLoading(false);
      }
    }

    fetchCerts();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F4F0E8]">
      <StarsBg />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#C7A46A] hover:text-[#D8BC8A] text-sm font-medium transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-heading tracking-tight">
            My <span className="text-[#C7A46A]">Certifications</span>
          </h1>
          <p className="text-[#A7A198] text-base sm:text-lg max-w-2xl">
            A verified collection of my technical skills, workshops, and inter-college achievements.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C7A46A] animate-spin mb-4" />
            <p className="text-[#A7A198] text-sm animate-pulse">Fetching your achievements...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-[#151517] rounded-2xl p-7 group hover:border-[#C7A46A]/40 transition-all duration-300 border border-[#302D28] shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#202023] border border-[#302D28] text-[#C7A46A] p-3 shadow-inner">
                    <BadgeCheck size={24} />
                  </div>

                  <h3 className="text-[#F4F0E8] font-bold text-lg mb-1 font-heading">{cert.title}</h3>
                  <p className="text-xs sm:text-sm font-medium mb-4 text-[#C7A46A]">
                    {cert.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#202023] border border-[#302D28] text-[#F4F0E8] text-xs sm:text-sm font-semibold hover:bg-[#C7A46A] hover:text-[#191919] hover:border-[#C7A46A] transition-all duration-300"
                >
                  <ExternalLink size={15} />
                  View Certificate
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && certs.length === 0 && (
          <div className="text-center py-20 bg-[#151517] rounded-3xl border border-dashed border-[#302D28]">
            <p className="text-[#A7A198] text-sm italic">No certificates found. Add some in your Admin Dashboard!</p>
          </div>
        )}
      </div>

      {/* Certificate Lightbox Modal */}
      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Footer />
    </main>
  );
}
