import { motion } from "framer-motion";
import { ArrowRight, Hammer, Heart, Leaf, Egg, Wheat, Droplets, ShoppingBag, Star, ChevronDown, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useBlogPosts } from "@/hooks/use-blog";
import { BlogCard } from "@/components/BlogCard";
import { useProducts } from "@/hooks/use-products";
import { PickupInfo } from "@/components/PickupInfo";
import { useSEO } from "@/lib/seo";

const stats = [
  { value: "23", label: "Backyard Hens", icon: "🐔" },
  { value: "2", label: "Best Friends", icon: "🤝" },
  { value: "~7 Dozen", label: "Eggs a Month", icon: "🥚" },
  { value: "1", label: "Coop (Mostly Upright)", icon: "🏚️" },
];

const shopCategories = [
  {
    icon: Egg,
    title: "Fresh Eggs",
    desc: "Pasture-raised, mixed colors, request-based pickup.",
    href: "/eggs",
    cta: "Order Eggs",
  },
  {
    icon: Wheat,
    title: "Baked Goods",
    desc: "Weekly bread pre-orders, baked and hand-shaped.",
    href: "/bread",
    cta: "Pre-Order Bread",
  },
  {
    icon: Droplets,
    title: "Honey",
    desc: "Raw local honey from our own hives.",
    href: "/shop",
    cta: "Coming Soon",
    comingSoon: true,
  },
  {
    icon: ShoppingBag,
    title: "Farm Merch",
    desc: "Coop plans, tees, and gear we actually use.",
    href: "/shop",
    cta: "Shop Merch",
  },
];

const testimonials = [
  {
    quote: "These eggs changed my breakfast and possibly my outlook on life.",
    author: "— definitely not Matt's mom",
  },
  {
    quote: "I didn't know pink was an option!",
    author: "— Kelsey Walsh",
  },
  {
    quote: "My kids now want chickens because of your Instagram. Thanks, I think?",
    author: "— A slightly resentful neighbor",
  },
];

export default function Home() {
  useSEO({
    title: "Fresh Eggs, Bread, Honey & Farm Merch",
    description: "Eggsistential Farms is a backyard co-op selling pasture-raised eggs, hand-baked bread, raw honey (coming soon), and farm merch — local pickup or shipping.",
    path: "/",
  });
  const { data: posts, isLoading: postsLoading } = useBlogPosts();
  const { data: products } = useProducts();

  const featuredPosts = posts?.slice(0, 2) || [];
  const featuredProducts = products?.filter(p => p.isFeatured && !p.comingSoon).slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-chickens.jpg"
            alt="Free range chickens roaming in backyard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-background" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/90 text-white text-sm font-semibold mb-6 tracking-wide backdrop-blur-md shadow-lg">
              Fresh Eggs • Baked Goods • Honey • Farm Goods
            </span>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Real farm goods,{" "}
              <br />
              <span className="text-accent/95 italic font-display">straight from our backyard.</span>
            </h1>

            <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              We're Eggsistential Farms — a backyard co-op run by two best friends. Fresh eggs, hand-baked bread, honey (coming soon), and farm merch — no middlemen, no nonsense.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" data-testid="button-shop-now" className="bg-accent hover:bg-accent/90 text-white px-8 h-14 text-lg rounded-full shadow-xl shadow-accent/20">
                  Shop the Farm
                </Button>
              </Link>
              <Link href="/eggs">
                <Button size="lg" variant="outline" data-testid="button-order-eggs" className="bg-white/10 border-white/40 text-white hover:bg-white hover:text-primary px-8 h-14 text-lg rounded-full backdrop-blur-sm">
                  Order Our Eggs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.div>
      </section>

      {/* ─── THE CO-OP STORY SNIPPET ─── */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] rotate-2" />
              <img
                src="/images/family-farm.jpg"
                alt="Our backyard co-op life"
                className="relative rounded-2xl shadow-2xl rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 w-full object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-xl shadow-xl max-w-xs hidden md:block border border-border/30">
                <p className="font-display text-primary text-lg leading-snug">
                  "We have ADHD and decided we wanted chickens in about two seconds flat."
                </p>
              </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
              <div>
                <span className="text-accent font-bold tracking-widest uppercase text-sm">Our Story</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
                  The <span className="text-accent italic">Co-op</span> Life
                </h2>
                <div className="w-20 h-1.5 bg-accent/30 rounded-full" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Eggsistential Farms started as a late-night text message between two best friends who had no land, no farming experience, and too many opinions about self-sufficiency. It became a real, actual backyard co-op — chickens, eggs, DIY coops, and all.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe you don't need 100 acres to be a farmer. You just need a partner in crime, a high tolerance for feathers, and the humility to admit when the coop falls down.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Hammer, title: "DIY Projects", desc: "Coops built on a budget & a prayer" },
                  { icon: Leaf, title: "Sustainability", desc: "Small steps, real impact" },
                  { icon: Heart, title: "Real Life", desc: "No filtered farm content here" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/about">
                <Button variant="link" className="text-accent p-0 h-auto font-semibold text-lg group">
                  Read our full train-wreck story
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHOP CATEGORIES ─── */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-accent font-bold tracking-wider uppercase text-sm">The Farm Shop</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
              What We're Selling
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything we raise, bake, and make — pick a category to get started.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopCategories.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card border border-border/50 rounded-2xl p-7 flex flex-col items-start hover:shadow-lg hover:border-primary/30 transition-all ${
                  item.comingSoon ? "opacity-80" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-1.5">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed flex-grow">{item.desc}</p>
                <Link href={item.href}>
                  <Button
                    variant={item.comingSoon ? "outline" : "default"}
                    className={`rounded-full w-full ${
                      item.comingSoon
                        ? "border-border/60 text-muted-foreground"
                        : "bg-accent hover:bg-accent/90 text-white"
                    }`}
                  >
                    {item.comingSoon && <Clock className="w-4 h-4 mr-2" />}
                    {item.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PICKUP INFO ─── */}
      <section className="pb-24 bg-background">
        <div className="container px-4 mx-auto max-w-2xl">
          <PickupInfo />
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-secondary/20">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-accent font-bold tracking-wider uppercase text-sm">Support the Farm</span>
                <h2 className="font-serif text-4xl font-bold mt-2">Featured Farm Goods</h2>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="hidden sm:flex border-primary/20 hover:border-primary">
                  Shop All
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href="/shop" className="group block">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.isFeatured && (
                        <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Popular
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">{product.category}</span>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
                      <span className="font-serif font-bold text-xl text-accent">
                        {product.priceCents ? `$${(product.priceCents / 100).toFixed(2)}` : "See details"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/shop">
                <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary rounded-full px-8 w-full">
                  Shop All Farm Goods
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── STATS STRIP ─── */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-3xl mb-1">{s.icon}</span>
                <span className="font-serif text-3xl md:text-4xl font-bold">{s.value}</span>
                <span className="text-primary-foreground/70 text-sm uppercase tracking-widest">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <h2 className="font-serif text-3xl font-bold">What the People Say</h2>
            <p className="text-muted-foreground mt-2">Completely unsolicited (mostly) reviews.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary/40 rounded-2xl p-6 border border-border/30"
              >
                <blockquote className="italic text-foreground/80 leading-relaxed mb-4">
                  "{t.quote}"
                </blockquote>
                <p className="font-bold text-sm text-primary">{t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FROM THE JOURNAL (small, secondary) ─── */}
      {(postsLoading || featuredPosts.length > 0) && (
        <section className="py-20 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-accent font-bold tracking-wider uppercase text-sm">From the Journal</span>
                <h2 className="font-serif text-3xl font-bold mt-2">A Few Recent Stories</h2>
              </div>
              <Link href="/blog">
                <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-foreground">
                  Read the Journal <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {postsLoading ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                  <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-8">
                {featuredPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog">
                <Button variant="outline" className="w-full">Read the Journal</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER ─── */}
      <section className="py-24 container px-4 mx-auto">
        <NewsletterForm />
      </section>
    </div>
  );
}
