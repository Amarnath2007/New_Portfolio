"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="w-full flex justify-center overflow-hidden pt-16 md:pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-[1px] w-full relative"
          style={{
            background: "linear-gradient(to right, transparent, #302D28 20%, #C7A46A 50%, #302D28 80%, transparent)",
          }}
        >
          {/* Subtle Champagne Glow */}
          <div 
            className="absolute inset-0 blur-[3px] opacity-40"
            style={{
              background: "linear-gradient(to right, transparent, #302D28 20%, #C7A46A 50%, #302D28 80%, transparent)",
            }}
          />
          
          {/* Soft Shimmer effect */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-1/3"
            style={{
              background: "linear-gradient(to right, transparent, rgba(199, 164, 106, 0.2), transparent)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
