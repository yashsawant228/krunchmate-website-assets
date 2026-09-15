import React, { Suspense, lazy, useEffect, useRef, useState } from "react";

// Lazy-load the heavy Three/R3F scene so the bundle only pays the cost when
// the viewer is actually mounted (IntersectionObserver-gated below).
const PouchScene = lazy(() => import("./pouch3d/PouchScene"));

const SIZES = {
  sm: { w: 200, h: 280 },
  md: { w: 320, h: 440 },
  lg: { w: 440, h: 620 },
};

const hasWebGL = (() => {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
})();

const prefersDataSaver =
  typeof navigator !== "undefined" && navigator.connection && navigator.connection.saveData === true;

/**
 * PouchViewer3D — real GLB-driven pouch viewer.
 *
 * Renders a static PNG fallback until the element scrolls into view; only
 * then mounts the R3F <Canvas>. On WebGL-unsupported or data-saver browsers,
 * the fallback stays permanent.
 */
export default function PouchViewer3D({ flavour, size = "lg", autoRotate = true }) {
  const { w: width, h: height } = SIZES[size] || SIZES.lg;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (!hasWebGL || prefersDataSaver) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const useFallback = !hasWebGL || prefersDataSaver;
  const sceneActive = !useFallback && visible;

  return (
    <div
      ref={ref}
      className="relative select-none"
      style={{ width, height }}
      data-testid={`pouch-viewer-${flavour.id}`}
      aria-label={`3D pouch — ${flavour.name}. Use the on-screen rotate buttons or drag to explore.`}
      role="img"
    >
      {/* Fallback PNG — only rendered while the 3D scene isn't active. Once
          the R3F canvas is mounted we unmount the PNG entirely so its
          white product-shot background doesn't bleed through the
          transparent WebGL canvas. */}
      {!sceneActive && (
        <img
          src={flavour.front}
          alt={`${flavour.name} pouch`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }}
          draggable={false}
        />
      )}

      {sceneActive && (
        <Suspense fallback={
          <img
            src={flavour.front}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-60"
          />
        }>
          <PouchScene flavour={flavour} autoRotate={autoRotate} />
        </Suspense>
      )}

      <div className="pouch-shadow" />
    </div>
  );
}
