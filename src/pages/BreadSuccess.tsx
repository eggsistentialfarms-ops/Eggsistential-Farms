import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useEffect } from "react";

export default function BreadSuccess() {
  // Transactional page (only reachable after payment) — no reason
  // for this to show up in search results.
  useEffect(() => {
    document.title = "Order Confirmed | Eggsistential Farms";
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-lg w-full"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary mb-3">You're on the list!</h1>
        <p className="text-xl text-foreground/80 mb-2">Payment received — your loaf is reserved.</p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          We'll reach out with pickup details closer to bake day.
          Keep an eye on your inbox (and check spam just in case 🍞).
        </p>
        <div className="bg-secondary/40 rounded-2xl p-5 text-sm text-muted-foreground mb-8 leading-relaxed">
          <p className="font-semibold text-foreground mb-1">Storage reminder</p>
          Keep your loaf at room temp in a sealed bag. Best within 3–5 days.
          Do not refrigerate — freeze slices if you need to keep them longer.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/bread">
            <Button variant="outline" className="rounded-full px-6 border-border/60">
              <ShoppingBag className="w-4 h-4 mr-2" /> Order Another Loaf
            </Button>
          </Link>
          <Link href="/">
            <Button className="rounded-full px-6 bg-accent hover:bg-accent/90 text-white">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
