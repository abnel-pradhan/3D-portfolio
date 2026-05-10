import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "AI Chat", href: "#ai" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "backdrop-blur-md bg-black/40 border-b border-white/10" : ""
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl tracking-tighter">
            ABNEL<span className="text-[color:var(--accent)]">.</span>
          </span>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
            / PORTFOLIO — v2026
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
              className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" data-testid="nav-cta" className="btn-sharp btn-primary">
            Hire Me
          </a>
        </nav>

        <button
          data-testid="nav-menu-toggle"
          className="md:hidden p-2 text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-md"
        >
          <div className="container-x py-6 flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)] hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-sharp btn-primary w-full justify-center"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
}