import { Egg, Instagram, Youtube, Mail } from "lucide-react";
import { Link } from "wouter";
import { PICKUP_LOCATIONS } from "@/data/pickup";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3b352f] text-[#F0EDE8]">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* ─── BRAND ─── */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Eggsistential Farms Logo" className="h-10 w-10 object-contain" />
            <span className="font-serif text-lg font-bold leading-tight">Eggsistential<br />Farms</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Two best friends. Six opinionated chickens. A backyard co-op built on stubbornness and absolutely no prior experience.
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@eggsistentialfarms.com"
              aria-label="Email"
              className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ─── EXPLORE ─── */}
        <div>
          <h3 className="font-serif font-bold text-base mb-5 text-white">Explore</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop" className="text-white/60 hover:text-accent transition-colors">The Farm Shop</Link></li>
            <li><Link href="/eggs" className="text-white/60 hover:text-accent transition-colors">Order Eggs</Link></li>
            <li><Link href="/bread" className="text-white/60 hover:text-accent transition-colors">Bread Pre-Orders</Link></li>
            <li><Link href="/about" className="text-white/60 hover:text-accent transition-colors">Our Story</Link></li>
            <li><Link href="/blog" className="text-white/60 hover:text-accent transition-colors">Farm Journal</Link></li>
            <li><Link href="/contact" className="text-white/60 hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* ─── EGG PICKUP ─── */}
        <div>
          <h3 className="font-serif font-bold text-base mb-5 text-white">Egg Pickup Spots</h3>
          <ul className="space-y-2 text-sm text-white/60">
            {PICKUP_LOCATIONS.map((loc) => (
              <li key={loc}>{loc}</li>
            ))}
          </ul>
          <p className="text-xs text-white/40 mt-4 leading-relaxed">
            Eggs come unwashed by default.{" "}
            <Link href="/eggs" className="underline hover:text-accent transition-colors">Request an order →</Link>
          </p>
        </div>

        {/* ─── GET IN TOUCH ─── */}
        <div>
          <h3 className="font-serif font-bold text-base mb-5 text-white">Say Hello</h3>
          <p className="text-white/60 text-sm mb-4 leading-relaxed">
            Have a question, farming fail to share, or just want to say hi? We're pretty easy to reach.
          </p>
          <a
            href="mailto:hello@eggsistentialfarms.com"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
          >
            <Mail className="h-4 w-4" />
            hello@eggsistentialfarms.com
          </a>
        </div>

      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <span>© {year} Eggsistential Farms. All rights reserved.</span>
          <span className="font-display text-sm text-white/30">Made with love, chaos, and chicken math.</span>
        </div>
      </div>
    </footer>
  );
}
