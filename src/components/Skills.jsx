import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const SKILL_WORDS = [
  { text: "REACT", color: "#ffffff" },
  { text: "NEXT.JS", color: "#A1A1AA" },
  { text: "NODE", color: "#ffffff" },
  { text: "MONGO", color: "#A1A1AA" },
  { text: "TAILWIND", color: "#ffffff" },
  { text: "AI", color: "#FF3300" },
  { text: "GIT", color: "#A1A1AA" },
  { text: "JS", color: "#ffffff" },
  { text: "VIDEO", color: "#FF3300" },
  { text: "THREE.JS", color: "#ffffff" },
];

// True 3D Text that orbits around the center
function OrbitWord({ text, color, radius, speed, offset, y }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      // Move in a circle
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      // Make the text face outward as it spins
      ref.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={ref} position={[0, y, 0]}>
      <Text
        fontSize={0.35}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </group>
  );
}

function Scene() {
  const words = useMemo(
    () =>
      SKILL_WORDS.map((w, i) => ({
        ...w,
        radius: 2.2 + (i % 3) * 0.6,
        speed: 0.18 + (i % 4) * 0.04,
        offset: (i / SKILL_WORDS.length) * Math.PI * 2,
        y: ((i % 5) - 2) * 0.65,
      })),
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#FF3300" />
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.4}>
        <group>
          {words.map((w, i) => (
            <OrbitWord key={i} {...w} />
          ))}
        </group>
      </Float>
    </>
  );
}

const SKILL_LIST = [
  "JavaScript (ES6+)",
  "React & Next.js",
  "Tailwind CSS",
  "Node.js & Express",
  "SQL / NoSQL",
  "Git & DevOps",
  "Three.js / R3F",
  "Creative AI Tools",
  "Video Editing",
];

export default function Skills({ isMobile }) {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative py-24 md:py-40 border-t border-white/10"
    >
      <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-5">
          <div className="section-label" data-testid="skills-label">
            003 / TOOLKIT
          </div>
          <h2 className="font-display text-5xl md:text-7xl mt-6 leading-[0.9] uppercase">
            Core
            <br />
            <span className="text-[color:var(--accent)]">Skills.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm text-[color:var(--muted)] leading-relaxed">
            A toolkit honed by shipping. Pick any tool — chances are I've broken it, fixed it, and
            used it in production.
          </p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {SKILL_LIST.map((s, i) => (
              <motion.li
                key={s}
                data-testid={`skill-${i}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 text-xs md:text-sm text-white border-b border-white/10 py-3"
              >
                <span className="text-[color:var(--accent)] font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </motion.li>
            ))}
          </ul>
        </div>

        <div
          className="md:col-span-7 relative h-[50vh] md:h-[70vh] border border-white/10 noise-bg"
          data-testid="skills-3d"
        >
          <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] font-mono z-10">
            ▲ ORBITAL/STACK
          </div>
          
          <Canvas
            dpr={isMobile ? 1 : [1, 2]}
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: !isMobile, alpha: true }}
          >
            <Scene />
          </Canvas>

          <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent)] font-mono z-10">
            ORBITAL VIEW
          </div>
        </div>
      </div>
    </section>
  );
}