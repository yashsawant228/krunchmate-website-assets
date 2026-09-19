import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";

// Preload both GLBs so a flavour swap is instant after the first mount.
useGLTF.preload("/models/pouch-salt-vinegar.glb");
useGLTF.preload("/models/pouch-peanut-butter.glb");

/**
 * Pouch — loads the flavour-specific GLB and exposes rotation via refs.
 * Auto-rotate respects prefers-reduced-motion.
 *
 * IMPORTANT: this component receives `modelUrl` from the parent's committed
 * flavour state — the same state that drives the light colours. So a mesh
 * swap and a light-colour swap always commit in the SAME React render pass,
 * eliminating the previous two-tone lighting race.
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
    const target = 2.0; // world units — tightened so the pouch stays contained
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
    // Idle sway (±8° around the forward axis, tightened for containment) —
    // keeps the pouch fully inside its viewer frame at every angle it reaches.
    if (autoRotate && !prefersReducedMotion && !rotationTarget.current.dragging) {
      const target = Math.sin(state.clock.elapsedTime * 0.6) * (8 * Math.PI / 180);
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
 *
 * Flavour-switch synchronisation:
 *   The target `flavour` prop can change at any moment. If we let the light
 *   colours track that prop directly while the mesh swap has its own async
 *   loading lifecycle, one can update ahead of the other and the pouch
 *   renders for a few frames as a hard two-tone split (outgoing palette on
 *   one half, incoming on the other).
 *
 *   Fix: we hold a `committedFlavour` state that both the mesh source and
 *   the light colours read from. When the parent's `flavour` prop changes,
 *   we PRELOAD the new GLB via GLTFLoader.loadAsync FIRST, and only after
 *   that resolves do we advance `committedFlavour`. Because both the
 *   <primitive> object and the <directionalLight> color props read from the
 *   same state slot, React commits them in the SAME render pass — mesh and
 *   lighting always match whichever pouch is visible.
 */
export default function PouchScene({ flavour, autoRotate }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rotationTarget = useRef({ x: 0, y: 0, dragging: false });
  const [, force] = useState(0);

  // Single source of truth for what is CURRENTLY visible + lit. Never lags
  // the mesh, never leads the mesh — always in lockstep.
  const [committedFlavour, setCommittedFlavour] = useState(flavour);

  // When the target flavour changes, wait until the new GLB is confirmed
  // loaded before advancing the committed state. This is the gate the bug
  // report asked for.
  useEffect(() => {
    if (committedFlavour.id === flavour.id) return;
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.loadAsync(flavour.model).then(() => {
      if (cancelled) return;
      // Prime drei's cache so the sync useGLTF() call inside <Pouch> resolves
      // immediately when we swap the modelUrl.
      useGLTF.preload(flavour.model);
      // Single state update → mesh source + light colours change in one
      // React commit → the reconciler applies both to three.js before the
      // next paint. No two-tone frame is possible.
      setCommittedFlavour(flavour);
    });
    return () => { cancelled = true; };
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

  // Every visual property is derived from `committedFlavour` — never from
  // the raw target `flavour` prop. That's the whole point of the fix.
  const accent = committedFlavour.colors[3];
  const rim = committedFlavour.colors[1];

  return (
    <div className="absolute inset-0" onPointerDown={onPointerDown} data-testid={`pouch-scene-${committedFlavour.id}`}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Neutral fill so the printed labels stay legible. */}
        <ambientLight intensity={0.55} color="#FFFBE5" />
        {/* Gold key light — from the guideline (flavour-independent). */}
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F6A81E" />
        {/* Palette-accent rim to tint edges in the active flavour. */}
        <directionalLight position={[-4, 2, -3]} intensity={0.9} color={accent} />
        <directionalLight position={[0, -3, 2]} intensity={0.35} color={rim} />

        <Environment preset="studio" />

        <Pouch
          modelUrl={committedFlavour.model}
          autoRotate={autoRotate}
          rotationTarget={rotationTarget}
          prefersReducedMotion={prefersReducedMotion}
          mirrorTexture={!!committedFlavour.mirrorTexture}
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
