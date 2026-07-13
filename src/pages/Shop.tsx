import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShoppingBag, ExternalLink, Tag, Egg, Wheat, Clock, Truck, MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { PickupInfo } from "@/components/PickupInfo";
import type { Product } from "@shared/types";
import { useSEO } from "@/lib/seo";

async function startProductCheckout({ productId, size }: { productId: number; size?: string }) {
  const res = await fetch("/.netlify/functions/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: productId, quantity: 1, size }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to start checkout");
  }
  const { url } = (await res.json()) as { url: string };
  window.location.href = url;
}

const categoryLabels: Record<string, string> = {
  "all": "Everything",
  "coop-plans": "Coop Plans",
  "merch": "Merch",
  "supplies": "Supplies",
  "honey": "Honey",
};

type SortOption = "featured" | "price-asc" | "price-desc";

// Quick links to the two categories that live on their own pages,
// since they need pickup details up front (not a simple add-to-cart).
const quickLinks = [
  {
    icon: Egg,
    title: "Fresh Eggs",
    desc: "Pasture-raised, mixed colors. Request a pickup.",
    href: "/eggs",
    cta: "Order Eggs",
  },
  {
    icon: Wheat,
    title: "Baked Goods",
    desc: "Weekly bread pre-orders, baked by hand.",
    href: "/bread",
    cta: "Pre-Order Bread",
  },
];

function ProductCard({
  product,
  index,
  onBuy,
  isPending,
}: {
  product: Product;
  index: number;
  onBuy: (product: Product, size?: string) => void;
  isPending: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.find((s) => !product.soldOutSizes?.includes(s)),
  );
  const needsSize = !!product.sizes?.length;
  const sizeChosenAndValid = !needsSize || (!!selectedSize && !product.soldOutSizes?.includes(selectedSize));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col ${
        product.comingSoon ? "opacity-80" : ""
      }`}
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.comingSoon && (
          <div className="absolute top-3 right-3 bg-foreground/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Clock className="w-3 h-3" /> Coming Soon
          </div>
        )}
        {!product.comingSoon && product.isFeatured && (
          <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Popular
          </div>
        )}
        {product.category && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            <Tag className="w-3 h-3" />
            {categoryLabels[product.category] || product.category}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed">
          {product.description}
        </p>

        {needsSize && (
          <div className="mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">Size</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes!.map((s) => {
                const soldOut = product.soldOutSizes?.includes(s);
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={soldOut}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[2.5rem] h-9 px-2 rounded-lg text-sm font-semibold border transition-all ${
                      soldOut
                        ? "border-border/40 text-muted-foreground/40 line-through cursor-not-allowed"
                        : active
                        ? "bg-primary text-white border-primary"
                        : "border-border/60 text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <span className="font-serif font-bold text-2xl text-accent">
            {product.priceCents
              ? `$${(product.priceCents / 100).toFixed(2)}`
              : product.comingSoon
              ? "Coming Soon"
              : "See details"}
          </span>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 gap-2 shadow-md shadow-primary/15 transition-all disabled:opacity-50"
          data-testid={`button-buy-${product.id}`}
          disabled={isPending || product.comingSoon || (needsSize && !sizeChosenAndValid)}
          onClick={() => {
            if (product.affiliateLink) {
              window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
            } else if (product.priceCents) {
              onBuy(product, selectedSize);
            }
          }}
        >
          {product.comingSoon ? (
            <>Notify Me Later <Clock className="w-4 h-4" /></>
          ) : product.affiliateLink ? (
            <>Check Price <ExternalLink className="w-4 h-4" /></>
          ) : (
            <>Buy Now <ShoppingBag className="w-4 h-4" /></>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  useSEO({
    title: "Farm Shop — Honey & Merch",
    description: "Shop farm merch, coop plans, and supplies from Eggsistential Farms. Free local pickup or flat-rate shipping.",
    path: "/shop",
  });
  const { data: products, isLoading } = useProducts();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: ({ product, size }: { product: Product; size?: string }) =>
      startProductCheckout({ productId: product.id, size }),
    onError: (err: Error) => {
      toast({ title: "Checkout error", description: err.message, variant: "destructive" });
    },
  });

  const allCategories = ["all", ...Array.from(new Set((products || []).map(p => p.category).filter(Boolean) as string[]))];

  const filteredAndSorted = useMemo(() => {
    let list = filter === "all" ? products : products?.filter(p => p.category === filter);
    list = list ? [...list] : list;
    if (list && sort !== "featured") {
      list.sort((a, b) => {
        const priceA = a.priceCents ?? Infinity;
        const priceB = b.priceCents ?? Infinity;
        return sort === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }
    return list;
  }, [products, filter, sort]);

  return (
    <div className="min-h-screen bg-background">

      {/* ─── HEADER ─── */}
      <section className="bg-secondary/30 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container px-4 mx-auto"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            The Farm Shop
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-5">
            Eggs, Bread, Honey & Farm Goods
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything we raise, bake, and make — straight from our backyard co-op to your kitchen table.
          </p>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto py-16">

        {/* ─── QUICK LINKS: EGGS & BREAD ─── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-7 flex flex-col items-start hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-1.5">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{item.desc}</p>
              <Link href={item.href}>
                <Button className="rounded-full px-6 bg-accent hover:bg-accent/90 text-white">
                  {item.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ─── CATALOG HEADER ─── */}
        <div className="text-center max-w-xl mx-auto mb-3">
          <span className="text-accent font-bold tracking-wider uppercase text-sm">Shop All Farm Goods</span>
          <h2 className="font-serif text-4xl font-bold text-primary mt-2 mb-3">Honey & Merch</h2>
        </div>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-12">
          <Truck className="w-4 h-4" /> Free local pickup or flat-rate shipping — you choose at checkout.
        </p>

        {/* ─── TOOLBAR: CATEGORY FILTER + SORT ─── */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              {allCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  onClick={() => setFilter(cat)}
                  data-testid={`filter-${cat}`}
                  className={`rounded-full px-6 transition-all ${
                    filter === cat
                      ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                      : "bg-transparent border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {categoryLabels[cat] || cat}
                </Button>
              ))}
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-[180px] rounded-full" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ─── PRODUCT GRID ─── */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSorted?.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                isPending={checkoutMutation.isPending}
                onBuy={(p, size) => checkoutMutation.mutate({ product: p, size })}
              />
            ))}
          </div>
        )}

        {/* ─── PICKUP INFO ─── */}
        <div className="max-w-2xl mx-auto mt-20">
          <PickupInfo />
        </div>

        {/* ─── FOOTER NOTE ─── */}
        <div className="mt-12 text-center max-w-lg mx-auto">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
            <p className="font-display text-primary text-lg mb-2">
              "We don't sell stuff we wouldn't use ourselves."
            </p>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
              <MapPinned className="w-4 h-4 shrink-0" />
              Prefer to skip shipping? Choose Local Pickup at checkout — it's free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
