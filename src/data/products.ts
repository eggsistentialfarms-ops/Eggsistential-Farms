import type { Product } from "../shared/types";

// ─────────────────────────────────────────────────────────────────
// HOW TO ADD OR EDIT A PRODUCT
// Copy one of the objects below and change the fields.
// - "category" should be one of: "coop-plans", "merch", "supplies", "honey"
// - If it's an affiliate/external product, fill in "affiliateLink"
//   and leave "priceCents" out — the button will say "Check Price"
//   and open that link.
// - If you want to sell it directly and take real payment on your
//   own site via Stripe, fill in "priceCents" (price in cents, e.g.
//   1999 = $19.99) and leave "affiliateLink" out — the button will
//   say "Buy Now" and open Stripe's secure checkout, where the
//   customer chooses Local Pickup (free) or Shipping (flat rate).
// - Selling something with sizes (like a shirt)? Add a "sizes" list,
//   e.g. sizes: ["S", "M", "L", "XL"]. If a size sells out, add it
//   to "soldOutSizes" and it'll show as unavailable but stay visible.
// - Not ready to sell something yet (like honey before your hives
//   are producing)? Set "comingSoon: true" and leave out both
//   "priceCents" and "affiliateLink" — it'll show a "Coming Soon"
//   badge instead of a buy button. Flip it to real pricing whenever
//   you're ready to actually sell it.
// This file is the source of truth for prices on BOTH the site and
// the checkout function, so prices can't be tampered with.
// ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 1,
    name: "Sample Coop Plan (PDF)",
    description:
      "Placeholder product. Replace with a real product name, description, and image.",
    priceCents: 1200,
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
    category: "coop-plans",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Farm Logo Tee",
    description: "Soft cotton tee with our farm logo. Bulk-printed locally — swap in your real design and photos.",
    priceCents: 2400,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "merch",
    isFeatured: true,
    sizes: ["S", "M", "L", "XL", "2XL"],
    soldOutSizes: [],
  },
  {
    id: 3,
    name: "Eggsistential Farms Sticker Pack",
    description: "Set of 3 die-cut vinyl stickers. Placeholder — swap in your real designs.",
    priceCents: 800,
    image:
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80",
    category: "merch",
  },
  {
    id: 4,
    name: "Farm Coffee Mug",
    description: "Ceramic mug, 11oz. Placeholder — swap in your real mug design and photos.",
    priceCents: 1600,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
    category: "merch",
  },
  {
    id: 5,
    name: "Sample Affiliate Item",
    description:
      "Placeholder for an affiliate product — an item you recommend but sell through another site.",
    affiliateLink: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=800&q=80",
    category: "supplies",
  },
  {
    id: 6,
    name: "Raw Local Honey",
    description:
      "Coming soon! Once our hives are up and running, this is where our raw honey will go up for sale.",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    category: "honey",
    comingSoon: true,
  },
];
