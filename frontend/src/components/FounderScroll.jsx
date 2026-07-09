import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useFlavour } from "../context/FlavourContext";

/**
 * FounderScroll — cinematic scroll-triggered sequence.
 * Palette shift between Teal and Brown happens as user scrolls through.
 */
export default function FounderScroll() {
  const ref = useRef(null);
  const { setFlavour } = useFlavour();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // On scroll cross halfway → switch palette
  React.useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.55 && v < 0.9) setFlavour("peanut-butter");
      if (v < 0.35) setFlavour("salt-vinegar");
    });
    return () => unsub();
  }, [scrollYProgress, setFlavour]);

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -140]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 8]);

  return (
    <section
      ref={ref}
      className="relative min-h-[220vh] gradient-story grain"
      data-testid="founder-scroll-section"
    >
      <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
        <div className="container-x px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div style={{ y: y1 }} className="lg:col-span-5">
            <div className="product-no mb-3">SECTION N0. 04</div>
            <h2 className="h-section font-display text-cream leading-[1.02]">
              From still ponds<br />
              in <span className="italic font-normal text-[color:var(--gold)]">Bihar</span>,<br />
              to your afternoon.
            </h2>
            <p className="mt-6 max-w-md text-cream/75 leading-relaxed">
              We work directly with smallholder farmers in Bihar — the traditional home of makhana —
              buying seeds by the pond, not the container. Every pouch is popped small-batch, seasoned
              in the UK, and shipped within 30 days of harvest.
            </p>
            <div className="mt-8 font-beth text-3xl text-[color:var(--gold)]">
              small hands. small batch. huge crunch.
            </div>
          </motion.div>

          <motion.div style={{ y: y2, scale, rotate }} className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <video
                src="/videos/sv-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--pal-0)] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream">
                <div>
                  <div className="product-no">FIELD RECORDINGS</div>
                  <div className="font-display text-xl mt-1">Darbhanga, Bihar</div>
                </div>
                <div className="font-rusty text-2xl text-[color:var(--gold)]">30 days seed→shelf</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Palette shift transition spacer — brown palette section */}
      <div className="relative min-h-[100vh] flex items-center gradient-hero grain" data-testid="palette-shift-section">
        <div className="container-x px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-24">
          <div className="lg:col-span-7 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <video
                src="/videos/pb-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--pal-0)] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream">
                <div>
                  <div className="product-no">SMALL-BATCH KITCHEN</div>
                  <div className="font-display text-xl mt-1">Popped in the UK</div>
                </div>
                <div className="font-rusty text-2xl text-[color:var(--gold)]">no fryer, ever</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="product-no mb-3">SECTION N0. 05</div>
            <h2 className="h-section font-display text-cream leading-[1.02]">
              A whole new palette.<br />
              <span className="italic font-normal text-[color:var(--gold)]">literally.</span>
            </h2>
            <p className="mt-6 max-w-md text-cream/75 leading-relaxed">
              Notice the shift? Every flavour brings its own colour world. Salt & Vinegar lives in
              the deep teal of a Bihari pond at dawn. Peanut Butter warms into the roasted-brown of
              a slow-tumbled kitchen at dusk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
