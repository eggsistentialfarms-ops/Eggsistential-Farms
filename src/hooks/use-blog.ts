import { useQuery } from "@tanstack/react-query";
import { blogPosts } from "@/data/blogPosts";

// Blog content now lives in src/data/blogPosts.ts instead of a database.
// These hooks keep the same {data, isLoading} shape the pages expect,
// so nothing else had to change.

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      return [...blogPosts]
        .filter((p) => p.isPublished)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      return blogPosts.find((p) => p.slug === slug) ?? null;
    },
    enabled: !!slug,
  });
}
