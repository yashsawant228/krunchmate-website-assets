// Central data source for KrunchMate flavours (frontend-only build).
// Copy uses British English throughout.
// All colour hex values trace directly to KrunchMate-Guideline.pdf.

export const FLAVOURS = {
  "salt-vinegar": {
    id: "salt-vinegar",
    number: "N0. 01",
    name: "Salt & Vinegar",
    tagline: "Sharp, briny, unapologetically loud.",
    shortName: "Salt & Vinegar",
    palette: "teal",
    description:
      "A crackling hit of British vinegar and hand-flaked sea salt, popped into feather-light water-lily seeds. Cinema-quality crunch, zero guilt.",
    long:
      "Sourced from the still ponds of Bihar, our makhana is popped small-batch, dusted with malt vinegar, sea salt and a whisper of black pepper. It is the crunch you remember from the corner chippy — reborn as a snack you can actually feel good about.",
    price: 2.50,
    servings: "3 servings",
    weight: "30g",
    model: "/models/pouch-salt-vinegar.glb",
    front: "/images/sv-front.png",
    back: "/images/sv-back.png",
    angle1: "/images/sv-angle1.png",
    angle2: "/images/sv-angle2.png",
    video: "/videos/sv-video.mp4",
    accent: "Bright teal · #3E9C93",
    colors: {
      0: "#082D33",
      1: "#1A525F",
      2: "#30716C",
      3: "#3E9C93",
      ink: "#1D2528",
    },
    nutrition: [
      { label: "Energy", value: "376 kcal / 100g" },
      { label: "Protein", value: "9.7g" },
      { label: "Fibre", value: "14.5g" },
      { label: "Fat", value: "2.1g" },
      { label: "Salt", value: "1.2g" },
    ],
    claims: ["Vegan", "Gluten-free", "High in fibre", "Air-popped, never fried"],
  },
  "peanut-butter": {
    id: "peanut-butter",
    number: "N0. 02",
    name: "Peanut Butter",
    tagline: "Nutty. Sweet. Dangerously moreish.",
    shortName: "Peanut Butter",
    palette: "brown",
    description:
      "Roasted-peanut warmth and a soft caramel finish, coating every lily-seed pop. Comfort in a pouch.",
    long:
      "We slow-tumble popped water-lily seeds in stone-ground peanut paste and a mere touch of coconut sugar. The result: a nutty, mildly sweet snack with proper protein and none of the palm-oil greasiness.",
    price: 2.50,
    servings: "3 servings",
    weight: "30g",
    model: "/models/pouch-peanut-butter.glb",
    front: "/images/pb-front.png",
    back: "/images/pb-back.png",
    angle1: "/images/pb-angle1.png",
    angle2: "/images/pb-angle2.png",
    video: "/videos/pb-video.mp4",
    accent: "Warm tan · #CE7E59",
    colors: {
      0: "#2E1412",
      1: "#572F20",
      2: "#7D4124",
      3: "#CE7E59",
      ink: "#2E1412",
    },
    nutrition: [
      { label: "Energy", value: "418 kcal / 100g" },
      { label: "Protein", value: "11.2g" },
      { label: "Fibre", value: "12.8g" },
      { label: "Fat", value: "8.4g" },
      { label: "Sugars", value: "6.2g" },
    ],
    claims: ["Vegan", "Gluten-free", "Source of protein", "No palm oil"],
  },
};

// Single source of pack pricing — every per-unit callout reads from here.
// Confirmed by user: mix-and-match is priced identically to single-flavour
// tiers at every pack size, so no separate mix-and-match tier exists.
export const PACK_TIERS = [
  { qty: 1, label: "Single pouch", subtitle: "1 × 30g", price: 2.50 },
  { qty: 3, label: "3-pack", subtitle: "3 × 30g · £2.00 per pouch", price: 6.00 },
  { qty: 6, label: "Box of 6", subtitle: "6 × 30g · £1.67 per pouch", price: 10.00 },
];

export const perUnit = (tier) => tier.price / tier.qty;

export const FLAVOUR_LIST = [FLAVOURS["salt-vinegar"], FLAVOURS["peanut-butter"]];

export const CLAIMS_STRIP = [
  "Popped, never fried",
  "Vegan · Gluten-free",
  "High in fibre",
  "Small-batch from Bihar",
  "Made for the UK",
  "Recyclable pouch",
  "No palm oil",
  "Under 130 kcal a handful",
];

export const REVIEWS = [
  {
    quote:
      "Genuinely the best-tasting healthy snack I've tried this year. The Salt & Vinegar is dangerously good.",
    author: "Sian W.",
    location: "London",
    flavour: "Salt & Vinegar",
  },
  {
    quote:
      "Peanut Butter Krunch is my 4pm ritual now. Feels like a treat, plays like a protein bar.",
    author: "Ravi P.",
    location: "Manchester",
    flavour: "Peanut Butter",
  },
  {
    quote:
      "Beautiful packaging, even better crunch. My kids can't tell it's healthy — that's the win.",
    author: "Helena M.",
    location: "Bristol",
    flavour: "Salt & Vinegar",
  },
  {
    quote:
      "I've replaced my afternoon crisps with these. Same satisfaction, none of the slump.",
    author: "Tom J.",
    location: "Edinburgh",
    flavour: "Peanut Butter",
  },
];

export const FAQS = [
  {
    q: "What exactly is makhana?",
    a: "Makhana — also called fox nut or popped water-lily seed — is a traditional Bihari superfood. The seeds are hand-harvested from lily ponds, sun-dried, then popped like popcorn using dry heat. No oil. No frying.",
  },
  {
    q: "Are KrunchMate snacks vegan and gluten-free?",
    a: "Yes to both, across every flavour. We only ever use plant-based ingredients and our facility is certified gluten-free.",
  },
  {
    q: "Where are you based and where do you ship?",
    a: "KrunchMate is a UK-based brand, sourcing our makhana directly from smallholder farms in Bihar, India. We ship to all UK postcodes with next-working-day delivery on orders over £15.",
  },
  {
    q: "How should I store the pouches?",
    a: "Somewhere cool, dry and out of direct sunlight. Once opened, roll the pouch down and clip it — the makhana will stay krunchy for around a week (though it never lasts that long in our office).",
  },
  {
    q: "Are the pouches recyclable?",
    a: "Yes. Our stand-up pouches are recyclable at any UK soft-plastic collection point (most major supermarkets). We are actively developing a home-compostable version for 2026.",
  },
  {
    q: "How much salt / sugar is in each flavour?",
    a: "Salt & Vinegar contains 1.2g of salt per 100g. Peanut Butter contains 6.2g of naturally occurring and added sugars per 100g — mostly from our light coconut-sugar coating.",
  },
  {
    q: "Do you offer wholesale or corporate packs?",
    a: "We do — get in touch via the Contact page and we will send over our trade sheet within one working day.",
  },
];

export const PILLARS = [
  {
    title: "Popped, not fried",
    body: "Dry heat, high pressure. That is the entire process. No oil, no seed extracts, no shortcut.",
  },
  {
    title: "Bihar-sourced",
    body: "Every seed is hand-harvested from smallholder ponds in Bihar, India — the world's traditional home of makhana.",
  },
  {
    title: "Made for the UK",
    body: "Blended, seasoned and packed in the UK to British food standards. British spelling, British palate.",
  },
];
