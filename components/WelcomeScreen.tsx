"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function WelcomeScreen() {
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  // Dismiss action with smooth upward slide
  const dismissWelcome = () => {
    if (isExiting) return;
    setIsExiting(true);

    // Restore page scrolling immediately so the underlying portfolio is accessible
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Unmount after transition duration completes
    setTimeout(() => {
      setIsMounted(false);
    }, shouldReduceMotion ? 150 : 850);
  };

  useEffect(() => {
    // If user loaded the page with an anchor hash (e.g. #projects or #about), skip intro
    if (typeof window !== "undefined" && window.location.hash) {
      setIsMounted(false);
      return;
    }

    // Lock page scroll while welcome screen is active
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Keyboard support (down arrow, page down, space, enter)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        dismissWelcome();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle touch gestures for mobile swipe up
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

    // Upward swipe threshold (swipe up delta > 40px, dominating horizontal movement)
    if (deltaY > 40 && deltaY > deltaX) {
      dismissWelcome();
    }
  };

  // Handle mouse wheel / trackpad scroll down on desktop
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 15) {
      dismissWelcome();
    }
  };

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={isExiting ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.8,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="fixed inset-0 h-screen h-[100dvh] z-[999] bg-[#080808] text-[#F4F0E8] overflow-hidden overscroll-none flex flex-col justify-between select-none"
    >
      {/* 1. ELEGANT MINIMALIST BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft corner ambient glows */}
        <div className="absolute -top-32 -left-32 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-[#C7A46A]/[0.035] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-[#C7A46A]/[0.035] blur-[120px]" />

        {/* Subtle flowing gold curved lines: Top-Left */}
        <svg
          viewBox="0 0 600 600"
          fill="none"
          className="absolute -top-10 -left-10 w-[300px] sm:w-[480px] lg:w-[580px] h-[300px] sm:h-[480px] lg:h-[580px] opacity-40 sm:opacity-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="topCurveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#C7A46A" stop-opacity="0.4" />
              <stop offset="60%" stop-color="#C7A46A" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#C7A46A" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="topCurveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F4F0E8" stop-opacity="0.3" />
              <stop offset="65%" stop-color="#C7A46A" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#C7A46A" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M-80 180 C120 180, 220 70, 480 -60" stroke="url(#topCurveGrad1)" strokeWidth="1.2" />
          <path d="M-50 260 C150 250, 280 130, 540 -30" stroke="url(#topCurveGrad2)" strokeWidth="1.4" />
          <path d="M-20 340 C190 320, 360 190, 600 20" stroke="url(#topCurveGrad1)" strokeWidth="0.9" strokeDasharray="5 7" opacity="0.6" />
        </svg>

        {/* Subtle flowing gold curved lines: Bottom-Right */}
        <svg
          viewBox="0 0 600 600"
          fill="none"
          className="absolute -bottom-10 -right-10 w-[300px] sm:w-[480px] lg:w-[580px] h-[300px] sm:h-[480px] lg:h-[580px] opacity-40 sm:opacity-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bottomCurveGrad1" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#C7A46A" stop-opacity="0.4" />
              <stop offset="60%" stop-color="#C7A46A" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#C7A46A" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="bottomCurveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#F4F0E8" stop-opacity="0.3" />
              <stop offset="65%" stop-color="#C7A46A" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#C7A46A" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M680 420 C480 420, 380 530, 120 660" stroke="url(#bottomCurveGrad1)" strokeWidth="1.2" />
          <path d="M650 340 C450 350, 320 470, 60 630" stroke="url(#bottomCurveGrad2)" strokeWidth="1.4" />
          <path d="M620 260 C410 280, 240 410, 0 580" stroke="url(#bottomCurveGrad1)" strokeWidth="0.9" strokeDasharray="5 7" opacity="0.6" />
        </svg>

        {/* Few extremely subtle golden particles/stars */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[
            { cx: "18%", cy: "22%", r: 0.9, op: 0.35 },
            { cx: "84%", cy: "18%", r: 1.1, op: 0.4 },
            { cx: "15%", cy: "76%", r: 0.8, op: 0.3 },
            { cx: "85%", cy: "74%", r: 1.0, op: 0.35 },
            { cx: "32%", cy: "14%", r: 0.7, op: 0.25 },
            { cx: "70%", cy: "85%", r: 0.7, op: 0.25 },
            { cx: "25%", cy: "86%", r: 0.6, op: 0.2 },
            { cx: "75%", cy: "28%", r: 0.8, op: 0.3 },
          ].map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#F4F0E8"
              opacity={star.op}
            />
          ))}
        </svg>
      </div>

      {/* Spacer to guarantee perfect vertical centering */}
      <div className="w-full h-8 sm:h-12 shrink-0 pointer-events-none" />

      {/* 2. MAIN CONTENT (CENTERED HORIZONTALLY & VERTICALLY) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center my-auto py-4">
        {/* A. ELEGANT AB MONOGRAM LOGO WITH GOLD ARC */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-5 sm:mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(199,164,106,0.2)]"
            >
              <defs>
                {/* Metallic Gold Gradient for Monogram */}
                <linearGradient id="abGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="35%" stopColor="#E5CFAB" />
                  <stop offset="70%" stopColor="#C7A46A" />
                  <stop offset="100%" stopColor="#9C793F" />
                </linearGradient>

                {/* Arc Gradient */}
                <linearGradient id="abArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C7A46A" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#FFFDF9" stopOpacity="1" />
                  <stop offset="100%" stopColor="#C7A46A" stopOpacity="0.15" />
                </linearGradient>

                {/* Soft Radial Ambient Glow */}
                <radialGradient id="abGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C7A46A" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#C7A46A" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Radial Core */}
              <circle cx="50" cy="50" r="45" fill="url(#abGlow)" />

              {/* Subtle gold outer orbital arc surrounding the monogram */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#abArcGrad)"
                strokeWidth="1.3"
                strokeDasharray="210 70"
                strokeLinecap="round"
                transform="rotate(-40 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#C7A46A"
                strokeOpacity="0.2"
                strokeWidth="0.8"
              />

              {/* Accent celestial orb on the arc */}
              <circle cx="81" cy="21" r="1.6" fill="#F4F0E8" />
              <circle cx="19" cy="79" r="1.2" fill="#C7A46A" opacity="0.6" />

              {/* AB Monogram Typography */}
              <text
                x="50"
                y="61"
                textAnchor="middle"
                fontFamily="'Manrope', sans-serif"
                fontWeight="800"
                fontSize="34"
                letterSpacing="-0.06em"
                fill="url(#abGoldGrad)"
              >
                AB
              </text>
            </svg>
          </div>
        </motion.div>

        {/* B. WELCOME TEXT WITH SUBTLE GOLD FLANKING LINES */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4"
        >
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#C7A46A]/60 to-[#C7A46A]" />
          <span className="text-[#C7A46A] text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase font-heading">
            WELCOME
          </span>
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#C7A46A]/60 to-[#C7A46A]" />
        </motion.div>

        {/* C. MY NAME: AMARNATH B */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mb-4 sm:mb-5"
        >
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading leading-[1.05]">
            <span className="text-[#F4F0E8] drop-shadow-[0_4px_25px_rgba(244,240,232,0.12)]">
              AMARNATH{" "}
            </span>
            <span className="text-[#C7A46A] gold-glow inline-block">B</span>
          </h1>
        </motion.div>

        {/* D. PROFESSIONAL IDENTITY */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 text-[9.5px] xs:text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.24em] uppercase text-[#A7A198] whitespace-nowrap"
        >
          <span>DEVELOPER</span>
          <span className="text-[#C7A46A] text-[7px] sm:text-[9px]">•</span>
          <span>ENTREPRENEUR</span>
          <span className="text-[#C7A46A] text-[7px] sm:text-[9px]">•</span>
          <span>TECH ENTHUSIAST</span>
        </motion.div>
      </div>

      {/* 3. E. SWIPE INDICATOR (BOTTOM CENTER) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 1.05 }}
        onClick={dismissWelcome}
        className="relative z-20 w-full flex flex-col items-center justify-center cursor-pointer group select-none pb-7 sm:pb-9 pt-2"
        role="button"
        tabIndex={0}
        aria-label="Swipe up to explore portfolio"
      >
        {/* Upward bouncing gold chevrons */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center -space-y-1.5 text-[#C7A46A] transition-transform group-hover:scale-110"
        >
          <ChevronUp size={18} className="text-[#C7A46A] stroke-[2.5]" />
          <ChevronUp size={18} className="text-[#C7A46A]/60 stroke-[2]" />
        </motion.div>

        {/* Swipe up text */}
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C7A46A]/90 mt-2 font-heading transition-colors group-hover:text-[#F4F0E8]">
          SWIPE UP TO EXPLORE
        </span>
      </motion.div>
    </motion.div>
  );
}
