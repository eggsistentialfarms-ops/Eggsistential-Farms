import { useBlogPosts } from "@/hooks/use-blog";
import { BlogCard } from "@/components/BlogCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSEO } from "@/lib/seo";

const categories = ["All", "DIY Projects", "Chicken Care", "Farm Life"];

export default function Blog() {
  useSEO({
    title: "Farm Journal",
    description: "Stories, DIY coop builds, and chicken chaos from Eggsistential Farms.",
    path: "/blog",
  });
  const { data: posts, isLoading } = useBlogPosts();
  const [filter, setFilter] = useState("All");

  const featuredPost = posts?.[0];
  const remainingPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background">

      {/* ─── PAGE HEADER ─── */}
      <section className="bg-primary/5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container px-4 mx-auto"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            The Coop Chronicles
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-5">
            Tales from the Backyard
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tutorials, DIY disasters, chicken wisdom, and the occasional rant about rooster behavior. Mostly unfiltered.
          </p>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto py-16">

        {/* ─── FEATURED POST HERO ─── */}
        {!isLoading && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
              <div className="aspect-[21/9] md:aspect-[3/1] bg-muted relative">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center">
                <div className="p-8 md:p-14 max-w-2xl">
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                    Latest Post
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/80 mb-6 leading-relaxed line-clamp-2 hidden md:block">
                    {featuredPost.excerpt}
                  </p>
                  <a href={`/blog/${featuredPost.slug}`}>
                    <Button className="bg-accent hover:bg-accent/90 text-white rounded-full px-6">
                      Read the Story
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── FILTER TABS ─── */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className={`rounded-full px-6 transition-all ${
                filter === cat
                  ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                  : "bg-transparent hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* ─── POSTS GRID ─── */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {posts?.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <div className="text-6xl mb-4">🐔</div>
                <p className="text-xl font-serif font-bold text-primary mb-2">The hens are thinking...</p>
                <p>No posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
