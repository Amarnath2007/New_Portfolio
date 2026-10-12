import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StarsBg from "@/components/StarsBg";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";
import { Eye, ShieldAlert, ArrowLeft } from "lucide-react";

interface HomeProps {
  searchParams?: {
    preview?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  const isPreviewRequested = searchParams?.preview === "true";
  const isDev = process.env.NODE_ENV === "development";
  const isPreviewMode = isPreviewRequested && isDev;

  const portfolio = getPortfolioData(isPreviewMode);

  return (
    <main className="relative min-h-screen">
      {/* Floating Preview Banner when reviewing local draft */}
      {isPreviewMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 sm:px-6 py-2.5 rounded-full bg-[#151517]/95 border border-[#C7A46A]/60 backdrop-blur-xl shadow-[0_10px_35px_rgba(199,164,106,0.25)] text-xs sm:text-sm animate-pulse-subtle">
          <div className="flex items-center gap-2 text-[#C7A46A] font-semibold">
            <Eye size={16} />
            <span>Local Preview Mode (Draft Content)</span>
          </div>
          <div className="w-[1px] h-4 bg-[#302D28]" />
          <Link
            href="/"
            className="text-[#A7A198] hover:text-[#F4F0E8] transition-colors"
          >
            Exit Preview
          </Link>
          <div className="w-[1px] h-4 bg-[#302D28]" />
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[#C7A46A] hover:text-[#D8BC8A] font-medium transition-colors"
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
        </div>
      )}

      <StarsBg />
      <Navbar />
      <Hero />
      <Skills data={portfolio.skills} />
      <Achievements data={portfolio.achievements} />
      <Certifications data={portfolio.certifications} />
      <Projects data={portfolio.projects} />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
