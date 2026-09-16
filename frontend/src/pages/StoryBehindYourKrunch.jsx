import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import YouTubeFacade from "../components/YouTubeFacade";

// GEO/AEO-friendly structure: question-phrased subheadings, direct-answer
// block under the H1, one idea per section.

const LAST_UPDATED = "9 January 2026";

const SECTIONS = [
  {
    id: "before-sunrise",
    heading: "Before Sunrise",
    body:
      "Rajesh's day starts before the light does. Four feet of floodwater, a woven basket balanced on a bamboo pole, and a pond that has fed his community for longer than anyone can quite agree on. The makhana seed doesn't make this easy — it never has. Too early, and it won't pop. Too late, and the water claims it back. There's a single window, and Rajesh has spent a lifetime learning to read it.",
  },
  {
    id: "a-skill-you-cant-rush",
    heading: "A Skill You Can't Rush",
    body:
      "This isn't a craft you can teach in a season. The hand-picking, the timing of the sun-drying, the exact moment to roast the seed over an open flame until it explodes into the light, crisp puff you're holding — these are skills handed down over generations in Darbhanga's makhana-farming communities, refined by hundreds of small corrections nobody ever wrote down. Rajesh didn't learn this from a manual. He learned it the way it's always been taught here: by watching, by doing, by getting it wrong until he didn't.",
  },
  {
    id: "natures-quality-control",
    heading: "Nature's Quality Control",
    body:
      "Of every 100 kilograms harvested, only 35 pop perfectly. That's not scarcity dressed up as marketing — it's the honest cost of doing this properly. Rajesh could cut corners. He doesn't. The seeds that don't make the cut aren't KrunchMate's problem to solve; they're the reason the ones that do taste the way they do.",
  },
  {
    id: "bihar-to-britain",
    heading: "Bihar to Britain",
    body:
      "When our founder Yash moved to the UK, he missed more than the taste of makhana — he missed the connection to the people who grow it. So he found Rajesh, and brought his water lily seeds here: a seed trusted for thousands of years in Ayurveda and Chinese medicine, now popped, seasoned, and packed a very long way from Darbhanga.",
  },
  {
    id: "every-bag-his-pride",
    heading: "Every Bag, His Pride",
    body:
      "We toss every batch in olive oil, season it by hand, and pack it knowing exactly whose hands it passed through first. Every krunch honours that journey. Every bag is a farmer's pride — Rajesh's, and now, when you open one, a little bit of yours too.",
  },
];

export default function StoryBehindYourKrunch() {
  return (
    <div className="pt-32 pb-28 px-5 lg:px-10" data-testid="story-page">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <div className="product-no mb-3">PAGE N0. 06 · FARMER STORY</div>
            <h1
              className="h-hero font-display text-cream leading-[0.94]"
              data-testid="story-h1"
            >
              The Story Behind<br />
              <span className="italic font-normal text-[color:var(--gold)]">Your Krunch.</span>
            </h1>

            {/* Direct-answer block, ~55 words, AEO-optimised */}
            <p
              className="mt-8 max-w-xl text-cream/85 leading-relaxed text-lg border-l-2 border-[color:var(--gold)] pl-5"
              data-testid="story-direct-answer"
            >
              Every KrunchMate pouch begins with Rajesh, a makhana farmer in
              Bihar's Darbhanga district, who wades into flooded ponds at sunrise
              to hand-harvest water lily seeds by a centuries-old method. This is
              his story — the patience, the skill, and the quiet stubbornness
              that turns a wild seed into your favourite krunch.
            </p>

            <div className="mt-6 flex items-center gap-4 text-cream/50 text-xs">
              <span className="uppercase tracking-[0.22em] font-display">Last updated</span>
              <span>{LAST_UPDATED}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
              className="relative"
              data-testid="story-hero-illustration"
            >
              <img
                src="/images/story/rajesh.png"
                alt="Line-art illustration of Rajesh, a Bihari makhana farmer, walking with a bamboo shoulder pole carrying a woven harvesting basket and a clay water pot."
                className="w-full h-auto max-w-md mx-auto"
                loading="eager"
                style={{
                  // PNG has a transparent background with dark line-art.
                  // Invert to cream tones so it reads directly on the teal
                  // page background — no white card needed.
                  filter:
                    "invert(93%) sepia(15%) saturate(475%) hue-rotate(6deg) brightness(102%)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Body sections — one idea per section, question-phrased subheadings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <aside className="lg:col-span-3 lg:sticky lg:top-32 self-start">
            <div className="product-no mb-4">JUMP TO</div>
            <ul className="space-y-3">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="link-underline text-cream/80 text-sm"
                    data-testid={`story-toc-${s.id}`}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#video" className="link-underline text-[color:var(--gold)] text-sm">
                  Watch the video
                </a>
              </li>
            </ul>
          </aside>

          <div className="lg:col-span-9 space-y-14">
            {SECTIONS.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.04, ease: [0.19, 1, 0.22, 1] }}
                data-testid={`story-section-${s.id}`}
              >
                <h2 className="font-display text-3xl lg:text-4xl text-cream mb-4">
                  {s.heading}
                </h2>
                <p className="text-cream/85 leading-relaxed text-lg max-w-2xl">{s.body}</p>
              </motion.section>
            ))}

            {/* Signature */}
            <div className="pt-2">
              <p className="font-beth text-4xl text-[color:var(--gold)]" data-testid="story-signature">
                — Yash
              </p>
              <p className="text-cream/50 text-xs mt-2">Founder, KrunchMate</p>
            </div>

            {/* Video section */}
            <section id="video" className="pt-6" data-testid="story-video-section">
              <p className="text-cream/80 mb-6 text-lg">
                As featured in Business Insider — see where it all begins.
              </p>
              <YouTubeFacade
                videoId="GAuCQe2qqro"
                title="The Story Behind Your Krunch — a KrunchMate short film"
              />
            </section>

            {/* Closing CTA */}
            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-gold" data-testid="story-cta-shop">
                Taste Rajesh's harvest <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-ghost" data-testid="story-cta-about">
                Back to Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
