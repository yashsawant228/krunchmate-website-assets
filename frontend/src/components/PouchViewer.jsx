import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * PouchViewer — 3D-rotatable stand-up pouch.
 * Uses the flavour's front/back PNGs as the two primary keyframes and
 * interpolates a pseudo-3D rotation via CSS transforms (per user brief).
 *
 * Props:
 *   flavour: { front, back, name, colors }
 *   autoRotate: boolean
 *   size: 'sm' | 'md' | 'lg'
 */
export default function PouchViewer({ flavour, autoRotate = true, size = "lg" }) {
  const stageRef = useRef(null);
  const rotY = useMotionValue(0);
  const rotX = useMotionValue(-6);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);

  const SIZES = { sm: { w: 200, h: 280 }, md: { w: 320, h: 440 }, lg: { w: 440, h: 620 } };
  const { w: width, h: height } = SIZES[size] || SIZES.lg;

  // Subtle idle sway (±10°) when idle and not dragging — avoids the pouch
  // ever going edge-on (which would hide it due to backface-visibility).
  useEffect(() => {
    if (!autoRotate || dragging || hover) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const elapsed = (t - start) / 1000;
      const target = Math.sin(elapsed * 0.7) * 14; // ±14deg
      rotY.set(target);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, dragging, hover, rotY]);

  const onPointerDown = useCallback(
    (e) => {
      setDragging(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startRotY = rotY.get();
      const startRotX = rotX.get();

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        rotY.set(startRotY + dx * 0.7);
        rotX.set(Math.max(-25, Math.min(25, startRotX - dy * 0.3)));
      };
      const onUp = () => {
        setDragging(false);
        // Ease back X to a slight tilt
        animate(rotX, -6, { duration: 0.6, ease: [0.19, 1, 0.22, 1] });
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [rotX, rotY]
  );

  const transform = useTransform([rotX, rotY], ([x, y]) => `rotateX(${x}deg) rotateY(${y}deg)`);

  return (
    <div
      className="pouch-stage relative select-none"
      style={{ width, height }}
      ref={stageRef}
      onPointerDown={onPointerDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="img"
      aria-label={`3D pouch — ${flavour.name}`}
      data-testid={`pouch-viewer-${flavour.id}`}
    >
      <motion.div
        className="pouch-3d relative w-full h-full"
        style={{ transform, cursor: dragging ? "grabbing" : "grab" }}
      >
        <div className="pouch-face">
          <img
            src={flavour.front}
            alt={`${flavour.name} pouch front`}
            className="w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.4)]"
            draggable={false}
          />
        </div>
        <div className="pouch-face pouch-face--back">
          <img
            src={flavour.back}
            alt={`${flavour.name} pouch back`}
            className="w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.4)]"
            draggable={false}
          />
        </div>
      </motion.div>
      <div className="pouch-shadow" />
    </div>
  );
}
