"use client";

export default function StarsBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep luxury obsidian gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C] via-[#111113] to-[#0B0B0C]" />
      
      {/* Very subtle warm ambient highlights — reduced to not compete with content */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C7A46A]/[0.015] blur-[160px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-[#202023]/25 blur-[140px]" />
      <div className="absolute top-3/4 right-1/3 w-80 h-80 rounded-full bg-[#C7A46A]/[0.01] blur-[140px]" />

      {/* Ambient stars — reduced count and opacity */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 60 }).map((_, i) => {
          const cx = (((i * 137.5) % 100)).toFixed(2);
          const cy = (((i * 97.3 + 23) % 100)).toFixed(2);
          const r = i % 7 === 0 ? 1.0 : i % 3 === 0 ? 0.6 : 0.4;
          const op = (0.06 + (i % 5) * 0.04).toFixed(2);
          return (
            <circle
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={r}
              fill="#F4F0E8"
              opacity={op}
            />
          );
        })}
      </svg>
    </div>
  );
}
