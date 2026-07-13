import { Link } from "wouter";
import { BlogPost } from "@shared/types";
import { format } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full" data-testid={`link-blog-${post.id}`}>
        <article className="bg-card h-full rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col">

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Date Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/45 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt
                ? format(new Date(post.publishedAt), "MMM d, yyyy")
                : "Draft"}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3
              className="font-serif text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-snug"
              data-testid={`text-post-title-${post.id}`}
            >
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>

            <span className="inline-flex items-center gap-1 text-accent font-semibold text-sm group-hover:gap-2 transition-all">
              Read Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
