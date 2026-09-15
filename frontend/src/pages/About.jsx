import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Waves, Sparkles, MapPin, ArrowRight } from "lucide-react";

const TIMELINE = [
  {
    year: "Early 2024",
    title: "A pond in Bihar",
    body: "Our founders visit smallholder makhana farmers in Darbhanga and taste the raw, un-adulterated version of what would become KrunchMate. The obsession begins.",
  },
  {
    year: "Late 2024",
    title: "The UK kitchen",
    body: "After 47 recipe iterations, we lock in two hero flavours — Salt & Vinegar for the classic British palate, and Peanut Butter for those who prefer their krunch on the sweet side.",
  },
  {
    year: "Early 2025",
    title: "First pouch, first krunch",
    body: "Launched to independent delis and specialist grocers across London, Manchester and Bristol. Sold out in six weeks.",
  },
  {
    year: "Late 2025",
    title: "Nationwide",
    body: "This is the year we come to your corner shop. Same tiny farms, same slow-tumble, same obsession — just at scale.",
  },
];

export default function About() {
  return (
    <div className="pt-32 pb-28 px-5 lg:px-10" data-testid="about-page">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-24">
          <div className="lg:col-span-7">
            <div className="product-no mb-3">PAGE N0. 03</div>
            <h1 className="h-hero font-display text-cream leading-[0.94]">
              Small pond,<br />
              <span className="italic font-normal text-[color:var(--gold)]">huge idea.</span>
            </h1>
            <p className="mt-6 max-w-xl text-cream/75 leading-relaxed text-lg">
              KrunchMate is a UK-founded snack brand with our heart still in Bihar, India — the
              traditional home of makhana. We started with a single pond, a single farmer, and a
              single question: why isn't this crackling, protein-rich seed on every UK shelf?
            </p>
            <p className="mt-4 max-w-xl text-cream/75 leading-relaxed">
              Two years and forty-seven test batches later, here we are. Every pouch you hold is the
              answer to that question.
            </p>
            <div className="mt-8">
              <Link
                to="/story-behind-your-krunch"
                className="btn-gold"
                data-testid="about-cta-rajesh"
              >
                Read Rajesh's full story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden"
            >
              <video
                src="/videos/sv-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--pal-0)]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-cream">
                <div className="font-beth text-3xl text-[color:var(--gold)]">from the source</div>
                <MapPin size={18} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Values row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-24">
          {[
            { icon: Leaf, title: "Plant-forward", body: "Every ingredient is plant-based. Every recipe is vegan and gluten-free by design." },
            { icon: Waves, title: "Pond-to-pouch", body: "Direct trade with Bihari smallholders — no middlemen, no shortcuts, no compromise." },
            { icon: Sparkles, title: "Small-batch", body: "We pop no more than 200kg at a time. Freshness over volume, always." },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-[color:var(--pal-ink)]/60 border border-cream/10"
              data-testid={`about-value-${i}`}
            >
              <v.icon size={26} className="text-[color:var(--gold)]" strokeWidth={1.4} />
              <h3 className="font-display text-2xl text-cream mt-5">{v.title}</h3>
              <p className="text-cream/70 mt-3 leading-relaxed text-sm">{v.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div className="max-w-2xl mb-14">
            <div className="product-no mb-3">CHAPTERS</div>
            <h2 className="h-section font-display text-cream">
              How we got here.<br />
              <span className="font-beth text-[color:var(--gold)] normal-case">(the short version.)</span>
            </h2>
          </div>

          <div className="relative border-l border-cream/15 ml-3">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="pl-10 pb-14 relative"
                data-testid={`timeline-${t.year}`}
              >
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[color:var(--gold)]" />
                <div className="product-no mb-1">{t.year}</div>
                <h3 className="font-display text-2xl text-cream">{t.title}</h3>
                <p className="text-cream/70 mt-2 max-w-2xl leading-relaxed">{t.body}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-cream/40 text-xs">
            Founder story continues — check back for our next chapter.
          </p>
        </div>
      </div>
    </div>
  );
}
