"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, ExternalLink, FileText, AlertCircle } from "lucide-react";

export interface CertificateModalData {
  title: string;
  issuer?: string;
  description?: string;
  file_url?: string;
}

interface CertificateModalProps {
  cert: CertificateModalData | null;
  onClose: () => void;
}

let pdfjsPromise: Promise<any> | null = null;

function getPdfjsLib(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/pdfjs/pdf.min.js";
    script.async = true;

    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("pdfjsLib not defined on window"));
      }
    };

    script.onerror = () => {
      // Fallback to CDN
      const cdnScript = document.createElement("script");
      cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      cdnScript.async = true;
      cdnScript.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(lib);
        } else {
          reject(new Error("PDF.js CDN load failed"));
        }
      };
      cdnScript.onerror = () => reject(new Error("Could not load PDF.js script"));
      document.head.appendChild(cdnScript);
    };

    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

export default function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation & lock background scroll
  useEffect(() => {
    if (!cert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(0.6, Number((z - 0.2).toFixed(1))));
      } else if (e.key === "0") {
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [cert, onClose]);

  // Load and render certificate when selected
  useEffect(() => {
    if (!cert || !cert.file_url) {
      if (cert) {
        setLoading(false);
        setError(true);
      }
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(false);
    setImages([]);
    setZoom(1);

    const fileUrl = cert.file_url.trim();

    // 1. Direct Image Check (.png, .jpg, .jpeg, .webp, .svg)
    if (/\.(jpeg|jpg|png|webp|svg|gif)(\?.*)?$/i.test(fileUrl)) {
      setImages([fileUrl]);
      setLoading(false);
      return;
    }

    // 2. PDF / Google Drive rendering via PDF.js
    async function loadCertificatePdf() {
      try {
        const isGDrive = /drive\.google\.com|docs\.google\.com/i.test(fileUrl);
        const fetchUrl = isGDrive
          ? `/api/certificate-pdf?url=${encodeURIComponent(fileUrl)}`
          : fileUrl;

        let arrayBuffer: ArrayBuffer;
        try {
          const res = await fetch(fetchUrl);
          if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
          arrayBuffer = await res.arrayBuffer();
        } catch (fetchErr) {
          // If direct fetch fails, fallback to API proxy
          const proxyUrl = `/api/certificate-pdf?url=${encodeURIComponent(fileUrl)}`;
          const res = await fetch(proxyUrl);
          if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
          arrayBuffer = await res.arrayBuffer();
        }

        if (isCancelled) return;

        const pdfjsLib = await getPdfjsLib();
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const pageImages: string[] = [];
        const pageLimit = Math.min(pdf.numPages, 3);

        for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
          const page = await pdf.getPage(pageNum);
          // High resolution scale (2.0) for crisp vector rendering on all displays
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          }).promise;

          if (isCancelled) return;
          pageImages.push(canvas.toDataURL("image/png"));
        }

        if (!isCancelled) {
          if (pageImages.length > 0) {
            setImages(pageImages);
            setLoading(false);
          } else {
            setError(true);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to render certificate PDF:", err);
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadCertificatePdf();

    return () => {
      isCancelled = true;
    };
  }, [cert]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {cert && (
        <motion.div
          key="certificate-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0B0B0C]/92 backdrop-blur-xl select-none"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Subtle Top Info Pill */}
          <div
            className="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-[#151517]/80 border border-[#302D28]/60 backdrop-blur-md shadow-xl text-center pointer-events-none max-w-[80vw] truncate"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs sm:text-sm font-semibold text-[#F4F0E8] font-heading">
              {cert.title}
            </span>
            {cert.issuer && (
              <span className="text-xs text-[#C7A46A] ml-2 hidden sm:inline font-medium">
                — {cert.issuer}
              </span>
            )}
          </div>

          {/* Minimal Close (X) Button Top-Right */}
          <button
            type="button"
            onClick={onClose}
            className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-[#151517]/85 hover:bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28]/70 hover:border-[#C7A46A]/50 transition-all duration-200 backdrop-blur-md shadow-2xl group focus:outline-none focus:ring-2 focus:ring-[#C7A46A]/40"
            aria-label="Close certificate"
          >
            <X size={22} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Main Viewer Area */}
          <div
            ref={containerRef}
            className="w-full h-full flex overflow-auto pt-16 pb-20 px-4 sm:px-8 md:px-12"
            onClick={onClose}
          >
            {/* Loading Indicator */}
            {loading && (
              <div
                className="flex flex-col items-center justify-center gap-4 text-center m-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#C7A46A]/20 border-t-[#C7A46A] animate-spin" />
                <p className="text-xs sm:text-sm text-[#A7A198] font-medium tracking-wide animate-pulse">
                  Rendering certificate...
                </p>
              </div>
            )}

            {/* Rendered Certificate (ONLY the certificate itself) */}
            {!loading && !error && images.length > 0 && (
              <div
                className="relative flex flex-col items-center justify-center gap-8 m-auto transition-transform duration-150 ease-out"
                style={{ transform: `scale(${zoom})` }}
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={imgSrc}
                    alt={`${cert.title} ${images.length > 1 ? `- Page ${index + 1}` : ""}`}
                    className="max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(199,164,106,0.12)] border border-[#302D28]/60 transition-shadow duration-300"
                    draggable={false}
                  />
                ))}
              </div>
            )}

            {/* Clean Portfolio Fallback */}
            {!loading && error && (
              <div
                className="bg-[#151517] border border-[#302D28] rounded-2xl sm:rounded-3xl p-8 sm:p-10 max-w-md text-center shadow-2xl relative m-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center mx-auto mb-5 shadow-inner">
                  {cert.file_url ? <FileText size={28} /> : <AlertCircle size={28} />}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#F4F0E8] font-heading mb-1.5">
                  {cert.title}
                </h4>
                {cert.issuer && (
                  <p className="text-xs sm:text-sm text-[#C7A46A] mb-4 font-medium">
                    {cert.issuer}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#A7A198] mb-6 leading-relaxed">
                  {cert.file_url
                    ? "Direct inline rendering could not be completed for this document. You can open and view the verified certificate directly."
                    : "No document URL is currently attached to this certificate."}
                </p>
                {cert.file_url && cert.file_url !== "#" && (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#191919] font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-[#C7A46A]/20"
                  >
                    <ExternalLink size={15} />
                    <span>Open Original Certificate</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Floating Minimal Zoom Pill Controls */}
          {!loading && !error && images.length > 0 && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#151517]/85 border border-[#302D28]/70 backdrop-blur-md shadow-2xl text-xs text-[#A7A198]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.2).toFixed(1))))}
                className="p-1 hover:text-[#C7A46A] transition-colors rounded-full"
                title="Zoom out (-)"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-[#F4F0E8] font-mono text-[11px] px-1 font-medium min-w-[42px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
                className="p-1 hover:text-[#C7A46A] transition-colors rounded-full"
                title="Zoom in (+)"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <div className="w-[1px] h-3 bg-[#302D28] mx-1" />
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="px-2 py-0.5 rounded text-[11px] font-medium hover:text-[#C7A46A] transition-colors"
                title="Reset zoom (0)"
              >
                Reset
              </button>
              {cert.file_url && cert.file_url !== "#" && (
                <>
                  <div className="w-[1px] h-3 bg-[#302D28] mx-1" />
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-[#C7A46A] transition-colors flex items-center gap-1 text-[11px]"
                    title="Open original document in new tab"
                  >
                    <ExternalLink size={13} />
                  </a>
                </>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
