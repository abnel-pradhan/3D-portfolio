import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: "p1",
    name: "NewarPrime",
    tag: "FLAGSHIP / 2026",
    desc: "My own learn & earn platform. Users learn skills, complete missions, and earn rewards. Built end-to-end — design to deploy.",
    stack: ["React", "Node", "MongoDB", "AI"],
    cover:
      "newarprime-bg.png",
    href: "https://www.newarprime.in/",
  },
  {
    id: "p2",
    name: "E-Commerce Platform",
    tag: "FULL-STACK",
    desc: "Production-ready storefront with product management, auth, cart and a smooth checkout flow.",
    stack: ["React", "Node.js", "MongoDB"],
    cover:
      "https://images.unsplash.com/photo-1729459101598-9baa041bd27b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9kZSUyMDNkJTIwYWJzdHJhY3QlMjBnZW9tZXRyeXxlbnwwfHx8fDE3NzgxMzY2ODd8MA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p3",
    name: "Real-time Chat App",
    tag: "REALTIME",
    desc: "Low-latency WebSocket chat. Rooms, presence, typing indicators — instant messaging done right.",
    stack: ["Vue.js", "Socket.IO", "Express"],
    cover:
      "https://images.unsplash.com/photo-1720962158789-9389a4f399da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxkYXJrJTIwdGVjaCUyMHVpJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc3ODEzNjY5MXww&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p4",
    name: "Data Visualization Dashboard",
    tag: "DATA-VIZ",
    desc: "Clean dashboard for complex datasets. Interactive D3.js charts, filters, and tooltips.",
    stack: ["HTML/CSS/JS", "D3.js", "Tailwind"],
    cover:
      "https://images.unsplash.com/photo-1764258560296-04404549a022?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbW9kZSUyMDNkJTIwYWJzdHJhY3QlMjBnZW9tZXRyeXxlbnwwfHx8fDE3NzgxMzY2ODd8MA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
];

function TiltCard({ p, index }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 15 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={p.href}
      data-testid={`project-card-${p.id}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="proj-card group relative block border border-white/10 bg-[color:var(--surface)]/60 backdrop-blur-sm overflow-hidden noise-bg"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={p.cover}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.3em] text-white font-mono bg-black/40 backdrop-blur px-2 py-1 border border-white/10">
          {p.tag}
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={14} className="text-white" />
        </div>
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl md:text-3xl uppercase leading-none">{p.name}</h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent)] font-mono">
            0{index + 1}
          </span>
        </div>
        <p className="mt-3 text-xs md:text-sm text-[color:var(--muted)] leading-relaxed">
          {p.desc}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-white/10 text-[color:var(--muted)] font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-24 md:py-40"
    >
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="section-label" data-testid="projects-label">
              002 / SELECTED WORK
            </div>
            <h2 className="font-display text-5xl md:text-7xl mt-6 leading-[0.9] uppercase">
              Recent
              <br />
              <span className="text-[color:var(--accent)]">Projects.</span>
            </h2>
          </div>
          <p className="md:text-right max-w-sm text-sm text-[color:var(--muted)]">
            Four products. One philosophy:{" "}
            <span className="text-white">ship fast, polish hard, stay weird.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS.map((p, i) => (
            <TiltCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}