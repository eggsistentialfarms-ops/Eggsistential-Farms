import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Egg, Wheat, Hammer } from "lucide-react";
import { useEffect } from "react";

export default function UnderConstruction({ pageName }: { pageName?: string }) {
  // This is a placeholder, not real content — keep it out of Google
  // entirely while the rest of the site is being built.
  useEffect(() => {
    document.title = "Under Construction | Eggsistential Farms";
    let el = document.querySelector('meta[name="robots"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex");
    return () => {
      el?.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
          <Hammer className="w-9 h-9" />
        </div>

        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          {pageName ? `${pageName} — ` : ""}Under Construction
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-5">
          We're Still Building This Page
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Thanks for stopping by! This part of the site is still a work in
          progress — but you can already order the good stuff.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/eggs">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 h-13 rounded-full gap-2 w-full sm:w-auto">
              <Egg className="w-5 h-5" /> Order Fresh Eggs
            </Button>
          </Link>
          <Link href="/bread">
            <Button size="lg" variant="outline" className="px-8 h-13 rounded-full gap-2 border-primary/30 hover:border-primary w-full sm:w-auto">
              <Wheat className="w-5 h-5" /> Pre-Order Bread
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
