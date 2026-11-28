import type { Category, Product, SubType } from "@/types/store";

function angleSet(slug: string): string[] {
  return [
    `/images/products/${slug}-1.png`,
    `/images/products/${slug}-2.png`,
    `/images/products/${slug}-3.png`,
    `/images/products/${slug}-4.png`,
  ];
}

export const CATEGORY_META: Record<
  Category,
  { label: string; tagline: string; subTypes: SubType[]; description: string }
> = {
  casual: {
    label: "Casual",
    tagline: "SNEAKERS & JOGGERS",
    subTypes: ["Sneakers", "Joggers"],
    description:
      "Chunky architectural soles, pastel & full-grain leathers, and breathable knit street runners.",
  },
  formal: {
    label: "Formal",
    tagline: "LOAFERS & FORMAL SHOES",
    subTypes: ["Loafers", "Formal Shoes"],
    description:
      "Refined penny loafers, rose-pearl tailored flats, block-heel Mary Janes, and lug-sole derbies.",
  },
  sports: {
    label: "Sports",
    tagline: "GRIPPERS & SPORTS SHOES",
    subTypes: ["Grippers", "Sports Shoes"],
    description:
      "High-traction turf/court grippers and responsive athletic trainers in vibrant street colorways.",
  },
  slippers: {
    label: "Slippers",
    tagline: "SLIPPERS & CROCS",
    subTypes: ["Slippers", "Crocs"],
    description:
      "Plush cloud EVA recovery slides and sculpted pastel & utility clogs built for everyday comfort.",
  },
};

export const ALL_SUBTYPES: SubType[] = [
  "Sneakers",
  "Joggers",
  "Loafers",
  "Formal Shoes",
  "Grippers",
  "Sports Shoes",
  "Slippers",
  "Crocs",
];

export const ANGLE_LABELS = [
  "3/4 Front",
  "Side Profile",
  "Sole & Heel",
  "Top View",
] as const;

export const EXCHANGE_POLICY = {
  short: "EXCHANGE ONLY (SIZE / DAMAGE) · NO RETURNS",
  detail:
    "Exchange only within 7 days for EU size issues or manufacturing damage. Strictly no returns or cash refunds.",
} as const;

export const PRODUCTS: Product[] = [
  // ========================
  // BOYS — CASUAL (3)
  // ========================
  {
    id: "zlv-01",
    slug: "zelvyn-apex-cobalt-runner",
    name: "ZELVYN Apex Cobalt Runner",
    sku: "ZLV-BC-01",
    gender: "boys",
    category: "casual",
    subType: "Sneakers",
    pricePKR: 16500,
    originalPricePKR: 22000,
    badge: "NEW DROP",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Cobalt / Coral", hex: "#0052FF" },
      { name: "Cloud White", hex: "#F3F4F8" },
      { name: "Coral Pulse", hex: "#FF4D1C" },
    ],
    description:
      "ZELVYN's signature multi-panel street runner uniting cobalt suede overlays, breathable white ballistic mesh, and a 48mm coral-accented Phylon midsole.",
    specs: {
      upper: "Electric Cobalt Suede & Full-Grain Calfskin",
      sole: "48mm Dual-Density EVA + High-Abrasion Tread",
      lining: "Breathable Micro-Perforated Sport Knit",
      fit: "True to EU Size — Generous Streetwear Toe Box",
      weight: "460g (Single Shoe, EU 42)",
      origin: "ZELVYN Studio Lahore / Season 01",
    },
    image: "/images/products/zelvyn-apex-cobalt-runner-1.png",
    images: angleSet("zelvyn-apex-cobalt-runner"),
    featured: true,
  },
  {
    id: "zlv-02",
    slug: "zelvyn-street-court-low",
    name: "ZELVYN Street Court Low",
    sku: "ZLV-BC-02",
    gender: "boys",
    category: "casual",
    subType: "Sneakers",
    pricePKR: 18900,
    badge: "BESTSELLER",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Jet / White", hex: "#141418" },
      { name: "Slate", hex: "#555563" },
      { name: "Ivory", hex: "#EFEFF3" },
    ],
    description:
      "Clean ZELVYN court-inspired low-top crafted with crisp smooth leather panels, flat waxed cotton laces, and a stitched cupsole built for everyday pavement command.",
    specs: {
      upper: "Full-Grain Nappa Leather",
      sole: "Stitched Cupsole with Recessed Grip Tread",
      lining: "Cushioned Collar & Perforated Footbed",
      fit: "True to EU Size",
      weight: "430g (Single Shoe, EU 42)",
      origin: "ZELVYN Archive Series",
    },
    image: "/images/products/zelvyn-street-court-low-1.png",
    images: angleSet("zelvyn-street-court-low"),
  },
  {
    id: "zlv-03",
    slug: "zelvyn-aero-slate-jogger",
    name: "ZELVYN Aero Slate Jogger",
    sku: "ZLV-BC-03",
    gender: "boys",
    category: "casual",
    subType: "Joggers",
    pricePKR: 14200,
    originalPricePKR: 28400,
    badge: "50% OFF",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Sand / Cream", hex: "#D6C5B3" },
      { name: "Graphite", hex: "#2A2A32" },
    ],
    description:
      "Featherweight ZELVYN lifestyle jogger combining brushed suede mudguards with open-cell mesh ventilation and a responsive nitrogen heel pod.",
    specs: {
      upper: "Brushed Nubuck Suede & Open Cell Knit",
      sole: "Nitrogen-Infused Phylon + Waffle Traction",
      lining: "Zero-Friction Seamless Sockliner",
      fit: "Snug Athletic — Size up if wide-footed",
      weight: "340g (Single Shoe, EU 42)",
      origin: "ZELVYN Season 01 Drop",
    },
    image: "/images/products/zelvyn-aero-slate-jogger-1.png",
    images: angleSet("zelvyn-aero-slate-jogger"),
  },

  // ========================
  // BOYS — FORMAL (2)
  // ========================
  {
    id: "zlv-04",
    slug: "zelvyn-heritage-lug-loafer",
    name: "ZELVYN Heritage Lug Loafer",
    sku: "ZLV-BF-01",
    gender: "boys",
    category: "formal",
    subType: "Loafers",
    pricePKR: 17500,
    badge: "BESTSELLER",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Espresso Black", hex: "#161414" },
      { name: "Chestnut Trim", hex: "#6B4423" },
    ],
    description:
      "Refined ZELVYN formal silhouette on a storm-welted micro-lug outsole, balancing sharp tailoring proportions with street-ready traction.",
    specs: {
      upper: "Waxed Box Calfskin",
      sole: "35mm Storm-Welted Commando Lug Rubber",
      lining: "Vegetable-Tanned Leather Interior",
      fit: "Relaxed Formal Last — True to EU Size",
      weight: "520g (Single Shoe, EU 42)",
      origin: "ZELVYN Atelier Craft",
    },
    image: "/images/products/zelvyn-heritage-lug-loafer-1.png",
    images: angleSet("zelvyn-heritage-lug-loafer"),
    featured: true,
  },
  {
    id: "zlv-05",
    slug: "zelvyn-sovereign-lug-derby",
    name: "ZELVYN Sovereign Lug Derby",
    sku: "ZLV-BF-02",
    gender: "boys",
    category: "formal",
    subType: "Formal Shoes",
    pricePKR: 21500,
    originalPricePKR: 26000,
    badge: "LIMITED",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Jet Calf", hex: "#0E0E14" },
      { name: "Slate", hex: "#40404A" },
    ],
    description:
      "Four-eyelet ZELVYN architectural derby engineered with a rounded square toe, padded heel collar, and heavy-gauge stacked tread.",
    specs: {
      upper: "Brushed Full-Grain Steerhide",
      sole: "42mm Stacked Rubber Lug Outsole",
      lining: "Memory-Foam Arch Leather Insole",
      fit: "True to EU Size",
      weight: "560g (Single Shoe, EU 42)",
      origin: "ZELVYN Numbered Release",
    },
    image: "/images/products/zelvyn-sovereign-lug-derby-1.png",
    images: angleSet("zelvyn-sovereign-lug-derby"),
  },

  // ========================
  // BOYS — SPORTS (3)
  // ========================
  {
    id: "zlv-06",
    slug: "zelvyn-vortex-turf-gripper",
    name: "ZELVYN Vortex Turf Gripper",
    sku: "ZLV-BS-01",
    gender: "boys",
    category: "sports",
    subType: "Grippers",
    pricePKR: 12800,
    badge: "NEW DROP",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Steel White", hex: "#E5E7EB" },
      { name: "Lime Volt", hex: "#84CC16" },
    ],
    description:
      "Precision ZELVYN artificial-turf and futsal gripper featuring directional micro-stud geometry, fused toe armor, and zero-slip midfoot compression.",
    specs: {
      upper: "Micro-Textured PU Knit + Fused TPU Cage",
      sole: "Multi-Directional Hexagonal Rubber Gripper Plate",
      lining: "Anti-Slip Heel Lock Microfiber",
      fit: "Locked-In Performance Fit",
      weight: "295g (Single Shoe, EU 42)",
      origin: "ZELVYN Performance Lab",
    },
    image: "/images/products/zelvyn-vortex-turf-gripper-1.png",
    images: angleSet("zelvyn-vortex-turf-gripper"),
    featured: true,
  },
  {
    id: "zlv-07",
    slug: "zelvyn-tactical-court-gripper",
    name: "ZELVYN Tactical Court Gripper",
    sku: "ZLV-BS-02",
    gender: "boys",
    category: "sports",
    subType: "Grippers",
    pricePKR: 11400,
    originalPricePKR: 22800,
    badge: "50% OFF",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Carbon / Coral", hex: "#1F2937" },
      { name: "Coral Stripe", hex: "#FF4D1C" },
    ],
    description:
      "High-grip ZELVYN indoor court and padel gripper engineered with razor-cut traction pods, lateral outrigger flange, and responsive ground contact.",
    specs: {
      upper: "Ballistic Jacquard Mesh & Synthetic Suede",
      sole: "Non-Marking Herringbone Gripper Sole",
      lining: "Moisture-Wicking Aero Mesh",
      fit: "True to EU Size",
      weight: "310g (Single Shoe, EU 42)",
      origin: "ZELVYN 11:11 Archive Drop",
    },
    image: "/images/products/zelvyn-tactical-court-gripper-1.png",
    images: angleSet("zelvyn-tactical-court-gripper"),
  },
  {
    id: "zlv-08",
    slug: "zelvyn-carbon-knit-trainer",
    name: "ZELVYN Carbon Knit Trainer",
    sku: "ZLV-BS-03",
    gender: "boys",
    category: "sports",
    subType: "Sports Shoes",
    pricePKR: 15900,
    badge: "BESTSELLER",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Midnight / Ember", hex: "#1C1C24" },
      { name: "Cloud Foam", hex: "#F3F4F8" },
    ],
    description:
      "ZELVYN all-terrain stability trainer built around a torsion-resistant midfoot shank and dual-density rebound foam for gym and sprint sessions.",
    specs: {
      upper: "3D Carbon-Weave Flyknit",
      sole: "Rebound Foam + Carbon Torsion Bridge",
      lining: "Seamless Compression Bootie",
      fit: "True to EU Size",
      weight: "325g (Single Shoe, EU 42)",
      origin: "ZELVYN Performance Lab",
    },
    image: "/images/products/zelvyn-carbon-knit-trainer-1.png",
    images: angleSet("zelvyn-carbon-knit-trainer"),
  },

  // ========================
  // BOYS — SLIPPERS (2)
  // ========================
  {
    id: "zlv-09",
    slug: "zelvyn-core-eva-slide",
    name: "ZELVYN Core EVA Slide",
    sku: "ZLV-BL-01",
    gender: "boys",
    category: "slippers",
    subType: "Slippers",
    pricePKR: 5400,
    badge: "BESTSELLER",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Pure Chalk", hex: "#F5F5F7" },
      { name: "Sky Pool", hex: "#38BDF8" },
    ],
    description:
      "Single-piece ZELVYN compression-molded EVA recovery slide with deep anatomical heel cup, drainage contours, and waterproof serrated traction.",
    specs: {
      upper: "One-Piece Closed-Cell EVA",
      sole: "38mm High-Rebound Serrated Base",
      lining: "Textured Quick-Dry Footbed",
      fit: "True to Size (Half sizes size up)",
      weight: "215g (Single Slide, EU 42)",
      origin: "ZELVYN Core Essentials",
    },
    image: "/images/products/zelvyn-core-eva-slide-1.png",
    images: angleSet("zelvyn-core-eva-slide"),
  },
  {
    id: "zlv-10",
    slug: "zelvyn-terrain-utility-croc",
    name: "ZELVYN Terrain Utility Croc",
    sku: "ZLV-BL-02",
    gender: "boys",
    category: "slippers",
    subType: "Crocs",
    pricePKR: 6900,
    badge: "NEW DROP",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Chalk Bone", hex: "#EAEAF0" },
      { name: "Slate", hex: "#525260" },
    ],
    description:
      "ZELVYN sculpted utility streetwear clog featuring aerodynamic side vents, pivoting heel lock strap, and durable outdoor tread lugs.",
    specs: {
      upper: "Dual-Injection Croslite Foam",
      sole: "Lugged Street-Grade EVA Outsole",
      lining: "Ergonomic Massaging Pod Footbed",
      fit: "Roomy Utility Fit",
      weight: "255g (Single Clog, EU 42)",
      origin: "ZELVYN Season 01 Essentials",
    },
    image: "/images/products/zelvyn-terrain-utility-croc-1.png",
    images: angleSet("zelvyn-terrain-utility-croc"),
  },

  // ========================
  // GIRLS — CASUAL (3) [GIRLY COLORS & SILHOUETTES]
  // ========================
  {
    id: "zlv-11",
    slug: "zelvyn-blush-platform-sneaker",
    name: "ZELVYN Blush Platform Sneaker",
    sku: "ZLV-GC-01",
    gender: "girls",
    category: "casual",
    subType: "Sneakers",
    pricePKR: 15800,
    badge: "NEW DROP",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Blush Pink", hex: "#F4A3B4" },
      { name: "Pearl White", hex: "#FFF5F7" },
      { name: "Rose Quartz", hex: "#FB7185" },
    ],
    description:
      "Girly-chic ZELVYN chunky platform sneaker uniting butter-soft blush pink leather panels with a sculpted pearl-white 52mm sole for effortless height.",
    specs: {
      upper: "Supple Blush Calfskin & Nubuck Trim",
      sole: "52mm Featherweight Sculpted EVA Platform",
      lining: "Plush Pastel Cotton Modal Lining",
      fit: "True to EU Size",
      weight: "385g (Single Shoe, EU 38)",
      origin: "ZELVYN Women's Flagship",
    },
    image: "/images/products/zelvyn-blush-platform-sneaker-1.png",
    images: angleSet("zelvyn-blush-platform-sneaker"),
    featured: true,
  },
  {
    id: "zlv-12",
    slug: "zelvyn-rose-court-low",
    name: "ZELVYN Rose Court Low",
    sku: "ZLV-GC-02",
    gender: "girls",
    category: "casual",
    subType: "Sneakers",
    pricePKR: 14500,
    originalPricePKR: 29000,
    badge: "50% OFF",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Dusty Rose", hex: "#E899A8" },
      { name: "Warm Cream", hex: "#FDF2E9" },
    ],
    description:
      "Sweet everyday ZELVYN court low-top pairing dusty rose suede overlays with warm cream leather and a low-profile cushioned cupsole.",
    specs: {
      upper: "Dusty Rose Suede & Cream Smooth Leather",
      sole: "Vulcanized Cream Rubber Cupsole",
      lining: "Cushioned Ortho-Foam Footbed",
      fit: "True to EU Size",
      weight: "345g (Single Shoe, EU 38)",
      origin: "ZELVYN 11:11 Archive Drop",
    },
    image: "/images/products/zelvyn-rose-court-low-1.png",
    images: angleSet("zelvyn-rose-court-low"),
    featured: true,
  },
  {
    id: "zlv-13",
    slug: "zelvyn-lilac-cloud-jogger",
    name: "ZELVYN Lilac Cloud Jogger",
    sku: "ZLV-GC-03",
    gender: "girls",
    category: "casual",
    subType: "Joggers",
    pricePKR: 13400,
    badge: "BESTSELLER",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Soft Lilac", hex: "#C4B5FD" },
      { name: "Peach Glow", hex: "#FDBA74" },
      { name: "Pearl", hex: "#FAF5FF" },
    ],
    description:
      "Feminine ZELVYN knit street jogger woven in pastel lilac mesh with peach lace accents and cloud-soft heel cushioning for all-day movement.",
    specs: {
      upper: "Breathable Lilac Rib-Knit & Peach Trim",
      sole: "Responsive Cloud-Cell Phylon Midsole",
      lining: "Adaptive Memory Collar",
      fit: "True to EU Size — Flexible Knit Upper",
      weight: "285g (Single Shoe, EU 38)",
      origin: "ZELVYN Season 01 Core",
    },
    image: "/images/products/zelvyn-lilac-cloud-jogger-1.png",
    images: angleSet("zelvyn-lilac-cloud-jogger"),
  },

  // ========================
  // GIRLS — FORMAL (2)
  // ========================
  {
    id: "zlv-14",
    slug: "zelvyn-rose-pearl-loafer",
    name: "ZELVYN Rose Pearl Loafer",
    sku: "ZLV-GF-01",
    gender: "girls",
    category: "formal",
    subType: "Loafers",
    pricePKR: 16200,
    badge: "BESTSELLER",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Rose Beige", hex: "#E5B4AE" },
      { name: "Pearl Cream", hex: "#FBF3EE" },
      { name: "Champagne Gold", hex: "#E9C46A" },
    ],
    description:
      "Glossy pastel rose-beige ZELVYN penny loafer finished with a pearl cream strap and delicate champagne gold hardware for crisp daytime and formal styling.",
    specs: {
      upper: "Glossy Pastel Rose Patent Calfskin",
      sole: "30mm Low Stacked Dress Heel + Grip Sole",
      lining: "Soft Nappa Cream Leather",
      fit: "True to EU Size",
      weight: "375g (Single Shoe, EU 38)",
      origin: "ZELVYN Atelier Craft",
    },
    image: "/images/products/zelvyn-rose-pearl-loafer-1.png",
    images: angleSet("zelvyn-rose-pearl-loafer"),
    featured: true,
  },
  {
    id: "zlv-15",
    slug: "zelvyn-champagne-block-heel",
    name: "ZELVYN Champagne Block Heel",
    sku: "ZLV-GF-02",
    gender: "girls",
    category: "formal",
    subType: "Formal Shoes",
    pricePKR: 18400,
    originalPricePKR: 23000,
    badge: "LIMITED",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Champagne Cream", hex: "#F5E6CC" },
      { name: "Blush Patent", hex: "#F2B5C4" },
    ],
    description:
      "Elegant ZELVYN Mary Jane block-heel formal shoe pairing glossy champagne cream patent leather with a blush pink ankle buckle and flared 45mm heel.",
    specs: {
      upper: "Champagne & Blush Glossy Patent Leather",
      sole: "45mm Sculpted Flared Block Heel + Cushion Pad",
      lining: "Cushioned Cream Leather Footbed",
      fit: "True to EU Size",
      weight: "390g (Single Shoe, EU 38)",
      origin: "ZELVYN Women's Atelier",
    },
    image: "/images/products/zelvyn-champagne-block-heel-1.png",
    images: angleSet("zelvyn-champagne-block-heel"),
  },

  // ========================
  // GIRLS — SPORTS (2)
  // ========================
  {
    id: "zlv-16",
    slug: "zelvyn-coral-pulse-gripper",
    name: "ZELVYN Coral Pulse Gripper",
    sku: "ZLV-GS-01",
    gender: "girls",
    category: "sports",
    subType: "Grippers",
    pricePKR: 11900,
    badge: "NEW DROP",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Coral Pink", hex: "#FB7185" },
      { name: "Lavender", hex: "#C084FC" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
    description:
      "Vibrant coral-pink and lavender ZELVYN studio & court gripper engineered for quick lateral cuts with multi-directional traction pods.",
    specs: {
      upper: "Breathable Coral-Lilac Knit & Lace Lock",
      sole: "360-Degree Radial Gripper Pod Rubber",
      lining: "Anti-Blister Pastel Cushion Mesh",
      fit: "Snug Athletic Fit",
      weight: "255g (Single Shoe, EU 38)",
      origin: "ZELVYN Women's Performance Lab",
    },
    image: "/images/products/zelvyn-coral-pulse-gripper-1.png",
    images: angleSet("zelvyn-coral-pulse-gripper"),
  },
  {
    id: "zlv-17",
    slug: "zelvyn-mint-tempo-runner",
    name: "ZELVYN Mint Tempo Runner",
    sku: "ZLV-GS-02",
    gender: "girls",
    category: "sports",
    subType: "Sports Shoes",
    pricePKR: 14800,
    badge: "BESTSELLER",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Mint Breeze", hex: "#6EE7B7" },
      { name: "Peach Coral", hex: "#FDA4AF" },
      { name: "Snow White", hex: "#F9FAFB" },
    ],
    description:
      "Featherlight pastel mint and peach ZELVYN running trainer featuring rocker geometry, ventilated knit upper, and springy EVA rebound sole.",
    specs: {
      upper: "Pastel Mint & White Aero Mesh",
      sole: "Peach-Coral Rocker EVA Midsole",
      lining: "Cooling Perforated Lining",
      fit: "True to EU Size",
      weight: "240g (Single Shoe, EU 38)",
      origin: "ZELVYN Women's Performance Lab",
    },
    image: "/images/products/zelvyn-mint-tempo-runner-1.png",
    images: angleSet("zelvyn-mint-tempo-runner"),
    featured: true,
  },

  // ========================
  // GIRLS — SLIPPERS (3)
  // ========================
  {
    id: "zlv-18",
    slug: "zelvyn-strawberry-pillow-slide",
    name: "ZELVYN Strawberry Pillow Slide",
    sku: "ZLV-GL-01",
    gender: "girls",
    category: "slippers",
    subType: "Slippers",
    pricePKR: 4900,
    originalPricePKR: 9800,
    badge: "50% OFF",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Strawberry Pink", hex: "#F472B6" },
      { name: "Soft Lavender", hex: "#C4B5FD" },
    ],
    description:
      "Ultra-plush ZELVYN two-tone strawberry pink and lavender puffy slide crafted in marshmallow-soft EVA foam with wave anti-slip tread.",
    specs: {
      upper: "Velvet-Matte Pastel Puffy EVA",
      sole: "36mm Wave Cushion Traction Base",
      lining: "Waterproof Anatomical Cradle",
      fit: "True to EU Size",
      weight: "185g (Single Slide, EU 38)",
      origin: "ZELVYN 11:11 Archive Drop",
    },
    image: "/images/products/zelvyn-strawberry-pillow-slide-1.png",
    images: angleSet("zelvyn-strawberry-pillow-slide"),
  },
  {
    id: "zlv-19",
    slug: "zelvyn-lilac-molded-croc",
    name: "ZELVYN Lilac Molded Croc",
    sku: "ZLV-GL-02",
    gender: "girls",
    category: "slippers",
    subType: "Crocs",
    pricePKR: 6400,
    badge: "NEW DROP",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Lilac Pearl", hex: "#D8B4FE" },
      { name: "Lavender Frost", hex: "#EDE9FE" },
    ],
    description:
      "Pastel lilac-pearl ZELVYN sculpted clog featuring smooth organic airflow vents, convertible ankle strap, and lightweight curved grip sole.",
    specs: {
      upper: "Pastel Seamless Bio-EVA Shell",
      sole: "42mm Curved Grip Tread",
      lining: "Micro-Textured Cloud Footbed",
      fit: "Relaxed Street Fit",
      weight: "220g (Single Clog, EU 38)",
      origin: "ZELVYN Season 01 Drop",
    },
    image: "/images/products/zelvyn-lilac-molded-croc-1.png",
    images: angleSet("zelvyn-lilac-molded-croc"),
    featured: true,
  },
  {
    id: "zlv-20",
    slug: "zelvyn-bubblegum-platform-croc",
    name: "ZELVYN Bubblegum Platform Croc",
    sku: "ZLV-GL-03",
    gender: "girls",
    category: "slippers",
    subType: "Crocs",
    pricePKR: 7200,
    badge: "LIMITED",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: [
      { name: "Bubblegum Pink", hex: "#EC4899" },
      { name: "Cotton Candy", hex: "#F9A8D4" },
    ],
    description:
      "Bold bubblegum-pink ZELVYN platform clog standing on a 55mm sawtooth outsole for playful everyday lift and effortless slip-on comfort.",
    specs: {
      upper: "High-Density Pastel Resin Foam",
      sole: "55mm Sawtooth Platform Lug Outsole",
      lining: "Contoured Quick-Dry Footbed",
      fit: "True to EU Size",
      weight: "265g (Single Clog, EU 38)",
      origin: "ZELVYN Women's Archive",
    },
    image: "/images/products/zelvyn-bubblegum-platform-croc-1.png",
    images: angleSet("zelvyn-bubblegum-platform-croc"),
  },

  // ========================
  // UNISEX HERO SILHOUETTES (4 — 1 per category)
  // ========================
  {
    id: "zlv-21",
    slug: "zelvyn-archive-01-sneaker",
    name: "ZELVYN Archive 01 Sneaker",
    sku: "ZLV-UX-01",
    gender: "unisex",
    category: "casual",
    subType: "Sneakers",
    pricePKR: 22500,
    originalPricePKR: 27500,
    badge: "LIMITED",
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Sunlit Cream", hex: "#F3E5D8" },
      { name: "Sandstone", hex: "#D6C4B0" },
    ],
    description:
      "The unisex flagship silhouette of Season 01. Multi-layered Italian-grade cream leather, warm suede mudguards, and an exaggerated sculpted heel.",
    specs: {
      upper: "Full-Grain Calfskin & Suede",
      sole: "54mm Multi-Chamber Architectural Sole",
      lining: "Quilted Soft Calf Lining",
      fit: "Unisex EU Sizing — Relaxed Volume",
      weight: "480g (Single Shoe, EU 42)",
      origin: "ZELVYN Flagship Drop",
    },
    image: "/images/products/zelvyn-archive-01-sneaker-1.png",
    images: angleSet("zelvyn-archive-01-sneaker"),
    featured: true,
  },
  {
    id: "zlv-22",
    slug: "zelvyn-atelier-formal-derby",
    name: "ZELVYN Atelier Formal Derby",
    sku: "ZLV-UX-02",
    gender: "unisex",
    category: "formal",
    subType: "Formal Shoes",
    pricePKR: 24500,
    badge: "LIMITED",
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Deep Jet", hex: "#0E0E14" },
      { name: "Slate", hex: "#35353F" },
    ],
    description:
      "Minimalist unisex dress derby pairing hand-lasted polished leather with a clean welted sole unit for sharp formal occasions.",
    specs: {
      upper: "Wholecut Calfskin Leather",
      sole: "40mm Storm-Welted Rubber Dress Outsole",
      lining: "Full Leather Interior",
      fit: "Unisex EU Sizing — True to Size",
      weight: "495g (Single Shoe, EU 42)",
      origin: "ZELVYN Atelier Flagship",
    },
    image: "/images/products/zelvyn-atelier-formal-derby-1.png",
    images: angleSet("zelvyn-atelier-formal-derby"),
  },
  {
    id: "zlv-23",
    slug: "zelvyn-kinetic-zero-trainer",
    name: "ZELVYN Kinetic Zero Trainer",
    sku: "ZLV-UX-03",
    gender: "unisex",
    category: "sports",
    subType: "Sports Shoes",
    pricePKR: 17900,
    originalPricePKR: 21500,
    badge: "NEW DROP",
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Graphite Mesh", hex: "#1F2937" },
      { name: "Pure Foam", hex: "#F3F4F8" },
    ],
    description:
      "Unisex ZELVYN marathon-grade trainer engineered with an exposed stability plate, high-traction rubber, and featherlight breathable mesh.",
    specs: {
      upper: "Zero-Seam Monofilament Mesh",
      sole: "Nitrogen PEBA Foam + Stability Plate",
      lining: "Breathable Lock-Down Heel Collar",
      fit: "Unisex Performance Fit",
      weight: "255g (Single Shoe, EU 42)",
      origin: "ZELVYN Performance Lab",
    },
    image: "/images/products/zelvyn-kinetic-zero-trainer-1.png",
    images: angleSet("zelvyn-kinetic-zero-trainer"),
  },
  {
    id: "zlv-24",
    slug: "zelvyn-halo-recovery-slide",
    name: "ZELVYN Halo Recovery Croc",
    sku: "ZLV-UX-04",
    gender: "unisex",
    category: "slippers",
    subType: "Crocs",
    pricePKR: 5800,
    badge: "BESTSELLER",
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: "Sunbeam Yellow", hex: "#FACC15" },
      { name: "Chalk", hex: "#F5F5F7" },
    ],
    description:
      "Vibrant unisex slip-on crafted from lightweight rebound EVA foam with breathable ventilation ports and outdoor grip tread.",
    specs: {
      upper: "Injection-Molded Rebound EVA",
      sole: "40mm Shock-Absorbing Tread Sole",
      lining: "Quick-Dry Contoured Footbed",
      fit: "Unisex EU Sizing",
      weight: "210g (Single Shoe, EU 42)",
      origin: "ZELVYN Core Essentials",
    },
    image: "/images/products/zelvyn-halo-recovery-slide-1.png",
    images: angleSet("zelvyn-halo-recovery-slide"),
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
