// Plain TypeScript types for content that used to live in a database.
// Editing content now means editing the files in src/data/ — see README.md.

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  isPublished: boolean;
  publishedAt: string; // ISO date string, e.g. "2026-05-01"
}

export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents?: number; // e.g. 1999 = $19.99 — set this to sell directly via Stripe
  affiliateLink?: string; // set this instead of priceCents for an external/affiliate item
  image: string;
  category: string; // 'coop-plans' | 'merch' | 'supplies' | 'honey'
  isFeatured?: boolean;
  comingSoon?: boolean; // shows a "Coming Soon" badge instead of a buy button
  sizes?: string[]; // e.g. ["S", "M", "L", "XL"] — shows a size picker before "Buy Now"
  soldOutSizes?: string[]; // sizes from the list above that are currently out of stock
}
