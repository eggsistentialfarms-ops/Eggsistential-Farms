// ─────────────────────────────────────────────────────────────────
// Bread pre-order catalog. This is the single source of truth for
// bread prices — both the website page AND the Stripe checkout
// function (netlify/functions/create-checkout.ts) read from this
// file, so prices always match and can't be tampered with by a
// visitor editing the request in their browser.
//
// To add/remove a loaf or change a price, edit the list below.
// "id" must stay unique and not change once you've shared a link
// to it. "price" is in whole dollars. Set "price: null" for an
// item that can't be pre-paid online (like the weekly special).
//
// "status" controls the availability badge:
//   "available" (default if omitted) — normal, orderable
//   "limited"   — shows a "Limited This Week" badge, still orderable
//   "sold-out"  — shows a "Sold Out" badge, can't be selected/ordered
// Update this whenever a loaf sells out or comes back — no need to
// touch anything else.
// ─────────────────────────────────────────────────────────────────

export interface BreadItem {
  id: string;
  label: string;
  price: number | null;
  desc: string;
  emoji: string;
  status?: "available" | "limited" | "sold-out";
}

export const BREADS: BreadItem[] = [
  {
    id: "classic-white",
    label: "Classic White Bread",
    price: 8,
    desc: "Soft, pillowy white loaf. Simple, reliable, and great for sandwiches.",
    emoji: "🍞",
    status: "available",
  },
  {
    id: "whole-wheat",
    label: "Fresh Milled Whole Wheat Bread",
    price: 10,
    desc: "Made with in-home freshly milled wheat flour. Better flavor, better nutrition.",
    emoji: "🌾",
    status: "available",
  },
  {
    id: "sourdough",
    label: "Sourdough",
    price: 12,
    desc: "Long-fermented, hand-shaped sourdough with a crackly crust.",
    emoji: "🫓",
    status: "available",
  },
  {
    id: "weekly-special",
    label: "Weekly Special Bake — check announcement",
    price: null,
    desc: "Check back each week for seasonal specials and limited bakes.",
    emoji: "📣",
    status: "available",
  },
];

export { PICKUP_LOCATIONS } from "./pickup";
