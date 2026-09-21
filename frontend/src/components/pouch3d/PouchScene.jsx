import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";

useGLTF.preload("/models/pouch-salt-vinegar.glb");
useGLTF.preload("/models/pouch-peanut-butter.glb");

const MANUAL_HOLD_MS = 1200;

function Pouch({ modelUrl, autoRotate, rotationTarget, prefersReducedMotion, mirrorTexture }) {
  const groupRef = useRef();
  const { scene } = useGLTF(modelUrl);
  const clone = React.useMemo(() => scene.clone(true), [scene]);

  const fitted = React.useMemo(() => {
    try {
      const box = new THREE.Box3().setFromObject(clone);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const target = 2.4;

      const scale = maxDim > 0 && !isNaN(maxDim) ? target / maxDim : 1.0;
      clone.scale.setScalar(scale);

      if (!isNaN(center.x) && !isNaN(center.y) && !isNaN(center.z)) {
        clone.position.copy(center).multiplyScalar(-scale);
      } else {
        clone.position.set(0, 0, 0);
      }

      // Balanced satin-finish material tuning — bright artwork with soft highlights
      clone.traverse((o) => {
        if (o.isMesh && o.material) {
          o.material.envMapIntensity = 0.25; // Subtle shimmer without washing out text
          o.material.roughness = 0.50;       // Smooth satin finish for rich colors
          o.material.metalness = 0.0;        // Non-metallic foil packaging
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
    } catch (error) {
      console.warn("Pouch bounding box calculation failed, defaulting to raw GLB:", error);
      return clone;
    }
  }, [clone, mirrorTexture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;

    const manualHold = performance.now() < rotationTarget.current.manualUntil;
    if (autoRotate && !prefersReducedMotion && !rotationTarget.current.dragging && !manualHold) {
      const target = Math.sin(state.clock.elapsedTime * 0.6) * ((8 * Math.PI) / 180);
      rotationTarget.current.y = target;
    }

    rotationTarget.current.x = Math.max(-0.6, Math.min(0.6, rotationTarget.current.x));
    g.rotation.y += (rotationTarget.current.y - g.rotation.y) * Math.min(1, delta * 6);
    g.rotation.x += (rotationTarget.current.x - g.rotation.x) * Math.min(1, delta * 6);
  });

  return <primitive object={fitted} ref={groupRef} />;
}

export default function PouchScene({ flavour, autoRotate }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rotationTarget = useRef({ x: 0, y: 0, dragging: false, manualUntil: 0 });
  const [, force] = useState(0);

  const [committedFlavour, setCommittedFlavour] = useState(flavour);

  useEffect(() => {
    if (committedFlavour.id === flavour.id) return;
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.loadAsync(flavour.model).then(() => {
      if (cancelled) return;
      useGLTF.preload(flavour.model);
      setCommittedFlavour(flavour);
    });
    return () => {
      cancelled = true;
    };
  }, [flavour, committedFlavour]);

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
      rotationTarget.current.x = 0;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const nudge = (dir) => {
    rotationTarget.current.y += dir * (Math.PI / 6);
    rotationTarget.current.manualUntil = performance.now() + MANUAL_HOLD_MS;
    force((v) => v + 1);
  };

  const accent = committedFlavour.colors[3];
  const rim = committedFlavour.colors[1];

  return (
    <div
      className="absolute inset-0"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      data-testid={`pouch-scene-${committedFlavour.id}`}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Warm studio ambient light */}
        <ambientLight intensity={0.7} color="#FFFBE5" />
        
        {/* Natural front-side directional lighting */}
        <directionalLight position={[4, 4, 4]} intensity={1.1} color="#FFF8E7" />
        <directionalLight position={[-4, 2, -2]} intensity={0.6} color={accent} />
        <directionalLight position={[0, -3, 2]} intensity={0.3} color={rim} />

        {/* Softened HDR studio reflections */}
        <Environment preset="studio" environmentIntensity={0.35} />

        <Center>
          <Pouch
            modelUrl={committedFlavour.model}
            autoRotate={autoRotate}
            rotationTarget={rotationTarget}
            prefersReducedMotion={prefersReducedMotion}
            mirrorTexture={!!committedFlavour.mirrorTexture}
          />
        </Center>

        <ContactShadows position={[0, -1.02, 0]} opacity={0.5} scale={4} blur={2.4} far={2} />
      </Canvas>

      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 pointer-events-none">
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="pointer-events-auto w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-cream bg-black/25 backdrop-blur-sm hover:border-gold hover:text-gold"
          aria-label="Rotate pouch left"
          data-testid="pouch3d-rotate-left"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          className="pointer-events-auto w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-cream bg-black/25 backdrop-blur-sm hover:border-gold hover:text-gold"
          aria-label="Rotate pouch right"
          data-testid="pouch3d-rotate-right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}