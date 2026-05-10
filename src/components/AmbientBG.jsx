/* eslint-disable */
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 140 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function CrossMarks({ count = 18 }) {
  const group = useRef();
  
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        pos: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10 - 4,
        ],
        r: Math.random() * Math.PI,
        s: 0.15 + Math.random() * 0.25,
      })),
    [count]
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.01;
    group.current.children.forEach((c, i) => {
      c.position.y = data[i].pos[1] + Math.sin(t * 0.3 + i) * 0.5;
      c.rotation.z = data[i].r + t * 0.1;
    });
  });

  return (
    <group ref={group}>
      {data.map((d, i) => (
        <group key={i} position={d.pos} scale={d.s}>
          <mesh>
            <boxGeometry args={[1, 0.1, 0.1]} />
            <meshBasicMaterial color="#FF3300" transparent opacity={0.35} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[1, 0.1, 0.1]} />
            <meshBasicMaterial color="#FF3300" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function AmbientBG({ isMobile }) {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      data-testid="ambient-bg"
      aria-hidden="true"
    >
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#070707"]} />
        <fog attach="fog" args={["#070707", 8, 24]} />
        <Particles count={isMobile ? 60 : 180} />
        <CrossMarks count={isMobile ? 8 : 22} />
      </Canvas>
    </div>
  );
}