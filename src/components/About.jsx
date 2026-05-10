import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="relative py-24 md:py-40">
      <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="section-label" data-testid="about-label">
            001 / ABOUT
          </div>
          <h2 className="font-display text-5xl md:text-7xl mt-6 leading-[0.9]">
            BUILDER
            <br />
            <span className="text-[color:var(--accent)]">/</span> STORY-
            <br />
            TELLER.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="md:col-span-8 md:col-start-6 space-y-6 text-base md:text-lg text-[color:var(--muted)] leading-relaxed"
          data-testid="about-body"
        >
          <p>
            I'm Abnel — a BCA student, full-stack developer and video storyteller based in Sikkim.
            I blend <span className="text-white">clean code</span>,{" "}
            <span className="text-white">cinematic frames</span> and{" "}
            <span className="text-white">creative AI</span> to ship products people actually use.
          </p>
          <p>
            Obsessed with craft. I spend late nights wiring up WebSocket backends, earlier mornings
            color-grading in the timeline, and every hour in between prompting AI models into
            doing something unexpected.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Based In
              </div>
              <div className="mt-2 text-white font-display text-2xl">Rhenock, Sikkim</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Currently
              </div>
              <div className="mt-2 text-white font-display text-2xl">Shipping NewarPrime</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}