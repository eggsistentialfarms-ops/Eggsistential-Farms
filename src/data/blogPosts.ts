import type { BlogPost } from "@shared/types";

// ─────────────────────────────────────────────────────────────────
// HOW TO ADD OR EDIT A BLOG POST
// Copy one of the objects below, change the fields, and give it a
// new unique "id" and "slug". The "slug" becomes the URL, e.g.
// slug: "my-first-post"  ->  yoursite.com/blog/my-first-post
// "content" supports plain text with blank lines between paragraphs.
// ─────────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to the Coop Chronicles",
    slug: "welcome-to-the-coop-chronicles",
    excerpt:
      "This is a placeholder post. Replace this with your first real story about backyard farming, chicken chaos, or whatever's going on around the homestead.",
    content: `This is a placeholder post — replace it with your own writing!

Open the file src/data/blogPosts.ts, find this post, and edit the title, excerpt, and this content section. Each paragraph should be separated by a blank line, just like this one.

Once you save the file and redeploy, your real post goes live.`,
    coverImage:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80",
    isPublished: true,
    publishedAt: "2026-06-01",
  },
  {
    id: 2,
    title: "Building Our First Coop: Lessons Learned",
    slug: "building-our-first-coop",
    excerpt:
      "Another placeholder post — swap in your own coop-building story, mistakes and all.",
    content: `Replace this with a real story about building your coop.

What worked, what didn't, what you'd do differently — readers love the honest version.`,
    coverImage:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&q=80",
    isPublished: true,
    publishedAt: "2026-05-15",
  },
];
