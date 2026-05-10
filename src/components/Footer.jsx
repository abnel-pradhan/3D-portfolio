import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-testid="footer"
      className="relative z-10 border-t border-white/10 py-10 mt-10"
    >
      <div className="container-x flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display text-3xl uppercase leading-none">
            ABNEL<span className="text-[color:var(--accent)]">.</span>
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
            © {year} — Designed &amp; built in Kathmandu
          </div>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
          <a href="#projects" className="hover:text-white transition-colors">
            Work
          </a>
          <a href="#ai" className="hover:text-white transition-colors">
            AI
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] font-mono">
          BUILT WITH ✦ R3F + CLAUDE
        </div>
      </div>
    </footer>
  );
}