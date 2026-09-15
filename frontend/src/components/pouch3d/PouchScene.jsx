import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";

// Preload both GLBs so a flavour swap is instant after the first mount.
useGLTF.preload("/models/pouch-salt-vinegar.glb");
useGLTF.preload("/models/pouch-peanut-butter.glb");

/**
 * Pouch — loads the flavour-specific GLB and exposes rotation via refs.
 * Auto-rotate respects prefers-reduced-motion.
 */
function Pouch({ modelUrl, autoRotate, rotationTarget, prefersReducedMotion, mirrorTexture }) {
  const groupRef = useRef();
  const { scene } = useGLTF(modelUrl);
  const clone = React.useMemo(() => scene.clone(true), [scene]);

  // Centre the model on its origin and normalise scale to fit the viewport.
  const fitted = React.useMemo(() => {
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center); // centre on origin
    const maxDim = Math.max(size.x, size.y, size.z);
    const target = 2.4; // world units — chosen against camera fov
    const scale = target / maxDim;
    clone.scale.setScalar(scale);
    // Tune material response so the pouch reads under our brand-only lighting.
    clone.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.envMapIntensity = 0.7;
        // Some GLBs ship with opposite UV winding — flip the diffuse map
        // horizontally so the printed labels read right-way-round.
        if (mirrorTexture && o.material.map) {
          const m = o.material.map.clone();
          m.wrapS = THREE.RepeatWrapping;
          m.repeat.x = -1;
          m.offset.x = 1;
          m.needsUpdate = true;
          o.material.map = m;
        }
        o.material.needsUpdate = true;
      }
    });
    return clone;
  }, [clone, mirrorTexture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    // Idle sway (±14° around the forward axis) — never lets the pouch go
    // edge-on / backwards, which would make the printed label read mirrored.
    if (autoRotate && !prefersReducedMotion && !rotationTarget.current.dragging) {
      const target = Math.sin(state.clock.elapsedTime * 0.6) * (14 * Math.PI / 180);
      rotationTarget.current.y = target;
    }
    g.rotation.y += (rotationTarget.current.y - g.rotation.y) * Math.min(1, delta * 6);
    g.rotation.x += (rotationTarget.current.x - g.rotation.x) * Math.min(1, delta * 6);
  });

  return <primitive object={fitted} ref={groupRef} />;
}

/**
 * PouchScene — the R3F canvas + brand-only lighting rig.
 * Palette hex values passed in as accent lights only — no arbitrary colour is
 * introduced.
 */
export default function PouchScene({ flavour, autoRotate }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rotationTarget = useRef({ x: 0, y: 0, dragging: false });
  const [, force] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const on = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const onPointerDown = useCallback((e) => {
    rotationTarget.current.dragging = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startRotY = rotationTarget.current.y;
    const startRotX = rotationTarget.current.x;
    let lastMove = 0;
    const onMove = (ev) => {
      // Throttle to ~60fps.
      const now = performance.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      rotationTarget.current.y = startRotY + dx * 0.01;
      rotationTarget.current.x = Math.max(-0.6, Math.min(0.6, startRotX + dy * 0.005));
    };
    const onUp = () => {
      rotationTarget.current.dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  // Accessibility fallback — arrow buttons rotate ±30°.
  const nudge = (dir) => {
    rotationTarget.current.y += dir * (Math.PI / 6);
    force((v) => v + 1);
  };

  // Only brand-palette colours are permitted for lighting.
  const accent = flavour.colors[3]; // teal-400 or brown-300
  const rim = flavour.colors[1];

  return (
    <div className="absolute inset-0" onPointerDown={onPointerDown}>
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Neutral fill so the printed labels stay legible. */}
        <ambientLight intensity={0.55} color="#FFFBE5" />
        {/* Gold key light — from the guideline. */}
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F6A81E" />
        {/* Palette-accent rim to tint edges in the active flavour. */}
        <directionalLight position={[-4, 2, -3]} intensity={0.9} color={accent} />
        <directionalLight position={[0, -3, 2]} intensity={0.35} color={rim} />

        <Environment preset="studio" />

        <Pouch
          modelUrl={flavour.model}
          autoRotate={autoRotate}
          rotationTarget={rotationTarget}
          prefersReducedMotion={prefersReducedMotion}
          mirrorTexture={!!flavour.mirrorTexture}
        />

        <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={4} blur={2.4} far={2} />
      </Canvas>

      {/* Keyboard-operable rotate buttons — the accessibility fallback. */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 pointer-events-none">
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="pointer-events-auto w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-cream bg-black/25 backdrop-blur-sm hover:border-gold hover:text-gold"
          aria-label="Rotate pouch left"
          data-testid="pouch3d-rotate-left"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          className="pointer-events-auto w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-cream bg-black/25 backdrop-blur-sm hover:border-gold hover:text-gold"
          aria-label="Rotate pouch right"
          data-testid="pouch3d-rotate-right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
