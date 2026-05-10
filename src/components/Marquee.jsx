import React from "react";

const ITEMS = [
  "FULL-STACK",
  "REACT + NEXT",
  "NODE.JS",
  "AI TOOLS",
  "VIDEO EDITING",
  "NEWARPRIME",
  "MONGODB",
  "THREE.JS",
];

export default function MarqueeBanner() {
  // Duplicate 4x for seamless infinite scroll at all screen sizes
  const row = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      data-testid="marquee"
      className="relative border-y border-white/10 bg-black/20 py-5 md:py-6 overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-white/80 flex-shrink-0 flex items-center"
            style={{ marginRight: "3rem" }}
          >
            {t}
            <span className="text-[color:var(--accent)] ml-12">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}