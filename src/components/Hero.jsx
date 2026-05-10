import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";

// Placeholder geometry shown when /abnel.png is missing or loading
function PlaceholderPlane() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.12;
    ref.current.rotation.x = Math.cos(t * 0.25) * 0.05;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.6}
          metalness={0.3}
          emissive={new THREE.Color("#FF3300")}
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Centered "AP" text as a visual stand-in */}
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshBasicMaterial color="#FF3300" transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

function PhotoPlane() {
  const [error, setError] = useState(false);
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.12;
    ref.current.rotation.x = Math.cos(t * 0.25) * 0.05;
  });

  if (error) return <PlaceholderPlane />;

  // Use useLoader dynamically only when not errored
  return <PhotoLoader onError={() => setError(true)} meshRef={ref} />;
}

function PhotoLoader({ onError, meshRef }) {
  // We wrap useLoader in its own component so error boundaries catch it
  let tex;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    tex = THREE.ImageLoader
      ? new THREE.TextureLoader().load("/abnel.png", undefined, undefined, onError)
      : null;
  } catch {
    onError();
    return null;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[3.2, 3.2, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          transparent
          roughness={0.4}
          metalness={0.2}
          emissive={new THREE.Color("#FF3300")}
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
}

function GlassShard({ position, rotation, scale }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = rotation[1] + t * 0.15;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.1;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.1}
        roughness={0.05}
        transmission={0.9}
        thickness={0.6}
        transparent
        opacity={0.4}
        ior={1.4}
        clearcoat={1}
      />
    </mesh>
  );
}

function Accent() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.z = t * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0, -2]} scale={6}>
      <ringGeometry args={[0.8, 0.82, 64]} />
      <meshBasicMaterial color="#FF3300" transparent opacity={0.4} />
    </mesh>
  );
}

// Error boundary for the entire Canvas
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center text-[color:var(--muted)] font-mono text-xs uppercase tracking-widest">
          <span className="text-[color:var(--accent)]">AP</span>&nbsp;/ 3D VIEW
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Hero({ isMobile }) {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center pt-24 md:pt-32"
    >
      <div className="container-x w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* LEFT — copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="md:col-span-7 relative z-10"
        >
          <div className="section-label mb-6" data-testid="hero-label">
            <span>BCA / Builder / Kathmandu</span>
          </div>
          <h1
            data-testid="hero-title"
            className="font-display text-[15vw] md:text-[8.5vw] leading-[0.85] tracking-tighter uppercase"
          >
            Abnel
            <br />
            <span className="text-[color:var(--accent)]">Pradhan</span>
            <span className="text-white">.</span>
          </h1>
          <p
            data-testid="hero-sub"
            className="mt-8 max-w-xl text-sm md:text-base text-[color:var(--muted)] leading-relaxed"
          >
            I build full-stack products, edit cinematic video, and experiment with creative AI
            tools. Currently shipping <span className="text-white">NewarPrime</span> — a learn
            &amp; earn platform for curious minds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              data-testid="hero-cta-projects"
              className="btn-sharp btn-primary"
            >
              View Work <ArrowDownRight size={16} />
            </a>
            <a href="#ai" data-testid="hero-cta-ai" className="btn-sharp">
              <Sparkles size={14} /> Ask My AI
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md text-[10px] md:text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] border-t border-white/10 pt-6">
            <div>
              <div className="font-display text-2xl md:text-4xl text-white">04</div>
              <div>Shipped Projects</div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-4xl text-white">∞</div>
              <div>Curiosity</div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-4xl text-[color:var(--accent)]">
                OPEN
              </div>
              <div>For Work</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — 3D canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="md:col-span-5 relative h-[55vh] md:h-[75vh] border border-white/10 noise-bg"
          data-testid="hero-3d-container"
        >
          {/* corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[color:var(--accent)] z-20" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[color:var(--accent)] z-20" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[color:var(--accent)] z-20" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[color:var(--accent)] z-20" />

          <CanvasErrorBoundary>
            <Canvas
              dpr={isMobile ? 1 : [1, 2]}
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: !isMobile, alpha: true }}
            >
              <ambientLight intensity={0.4} />
              <directionalLight position={[-5, 3, 4]} intensity={2} color="#ffffff" />
              <pointLight position={[3, -2, 3]} intensity={2} color="#FF3300" />
              <Suspense fallback={null}>
                <PlaceholderPlane />
                {!isMobile && (
                  <>
                    <GlassShard position={[-2.5, 1.8, -1]} rotation={[0.3, 0.4, 0]} scale={0.5} />
                    <GlassShard position={[2.6, -1.6, -1]} rotation={[0.6, 0.2, 0.1]} scale={0.4} />
                    <GlassShard position={[2.2, 1.9, -2]} rotation={[0.1, 0.5, 0.2]} scale={0.3} />
                    <GlassShard
                      position={[-2.3, -1.8, -1.5]}
                      rotation={[0.2, 0.3, 0.5]}
                      scale={0.35}
                    />
                  </>
                )}
                <Accent />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </CanvasErrorBoundary>

          {/* overlay caption */}
          <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] font-mono z-20">
            <span className="text-[color:var(--accent)]">●</span> LIVE — ABNEL / 2026
          </div>
          <div className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] font-mono z-20">
            CAM_01
          </div>
        </motion.div>
      </div>
    </section>
  );
}