import { Link, useLocation } from "wouter";
import { Menu, X, Egg } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/eggs", label: "Eggs" },
    { href: "/bread", label: "Bread" },
    { href: "/about", label: "Our Chaos" },
    { href: "/blog", label: "Farm Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-14 w-14 transition-transform group-hover:scale-105">
            <img 
              src="/logo.png" 
              alt="Eggsistential Farms Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="hidden font-display text-2xl font-bold tracking-tight text-foreground sm:inline-block">
            Eggsistential Farms
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location === link.href ? "text-accent font-bold" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-8 pt-10">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <div className="h-12 w-12 transition-transform">
                  <img 
                    src="/logo.png" 
                    alt="Eggsistential Farms Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-display text-xl font-bold">Eggsistential Farms</span>
              </Link>
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-accent ${
                      location === link.href ? "text-accent" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
