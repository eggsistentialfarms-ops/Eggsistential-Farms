import { useBlogPost, useBlogPosts } from "@/hooks/use-blog";
import { Link, useRoute } from "wouter";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BlogCard } from "@/components/BlogCard";
import { useSEO } from "@/lib/seo";

export default function PostDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts } = useBlogPosts();

  const relatedPosts = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];

  useSEO({
    title: post ? post.title : "Farm Journal",
    description: post?.excerpt || "Stories from Eggsistential Farms.",
    path: `/blog/${slug}`,
    image: post?.coverImage || "/logo.png",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-background text-center px-4">
        <div className="text-7xl">🐔</div>
        <h2 className="font-serif text-3xl font-bold text-primary">Post Not Found</h2>
        <p className="text-muted-foreground">The hens must have eaten it.</p>
        <Link href="/blog">
          <Button variant="outline">Back to the Blog</Button>
        </Link>
      </div>
    );
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <article className="min-h-screen bg-background">

      {/* ─── HERO HEADER ─── */}
      <div className="relative h-[55vh] md:h-[65vh] w-full bg-muted overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto max-w-3xl">
            <Link href="/blog">
              <Button variant="link" className="text-white/80 hover:text-white p-0 mb-6 gap-2 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Blog
              </Button>
            </Link>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : "Draft"}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🐔</span>
                <span>Eggsistential Farms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">

        {post.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed italic mb-10 border-l-4 border-accent/40 pl-6 py-1">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-a:text-accent prose-img:rounded-2xl prose-blockquote:border-accent prose-blockquote:font-display prose-blockquote:text-primary max-w-none text-foreground/80 leading-relaxed space-y-6">
          {paragraphs.map((para, i) => {
            if (para.startsWith("#")) {
              const level = para.match(/^#+/)?.[0].length || 1;
              const text = para.replace(/^#+\s*/, "");
              if (level === 1) return <h1 key={i} className="font-serif text-4xl font-bold text-primary mt-10 mb-4">{text}</h1>;
              if (level === 2) return <h2 key={i} className="font-serif text-3xl font-bold text-primary mt-8 mb-3">{text}</h2>;
              return <h3 key={i} className="font-serif text-2xl font-bold text-primary mt-6 mb-2">{text}</h3>;
            }
            if (para.startsWith(">")) {
              return (
                <blockquote key={i} className="border-l-4 border-accent/50 pl-6 py-1 text-primary font-display text-xl italic my-8">
                  {para.replace(/^>\s*/, "")}
                </blockquote>
              );
            }
            return (
              <p key={i} className={`text-lg leading-relaxed ${i === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:leading-none" : ""}`}>
                {para}
              </p>
            );
          })}
        </div>

        {/* ─── AUTHOR CARD ─── */}
        <div className="mt-16 flex items-center gap-5 bg-secondary/30 rounded-2xl p-6 border border-border/30">
          <div className="text-5xl">🐓</div>
          <div>
            <p className="font-bold text-lg text-foreground">Written by Eggsistential Farms</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Two best friends running a backyard co-op in the suburbs. We figure things out the hard way so you (maybe) don't have to.
            </p>
          </div>
        </div>

        {/* ─── NEWSLETTER ─── */}
        <div className="mt-16">
          <NewsletterForm />
        </div>
      </div>

      {/* ─── RELATED POSTS ─── */}
      {relatedPosts.length > 0 && (
        <div className="bg-secondary/20 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl font-bold text-primary">More from the Coop</h2>
              <Link href="/blog">
                <Button variant="link" className="text-accent gap-1 group">
                  All posts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relPost, i) => (
                <BlogCard key={relPost.id} post={relPost} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
