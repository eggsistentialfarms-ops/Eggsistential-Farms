import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Heart, Hammer, Leaf, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/lib/seo";

const timeline = [
  {
    year: "The Text",
    emoji: "📱",
    title: "The Fateful Message",
    desc: "An 11 PM text: \"What if we got chickens?\" Two seconds of consideration, zero research. We said yes.",
  },
  {
    year: "Week 1",
    emoji: "📦",
    title: "Thirteen Chicks Arrive",
    desc: "They came in a box. A cardboard box. We were not prepared. We put them in a tote in the living room for two weeks.",
  },
  {
    year: "Month 2",
    emoji: "🔨",
    title: "The Coop Disaster",
    desc: "We built it backwards. Literally. The door opened into a wall. We left it that way for a week before admitting it.",
  },
  {
    year: "Month 4",
    emoji: "🥚",
    title: "First Egg Day",
    desc: "We screamed. Our neighbor thought something terrible had happened. We called everyone we knew. No one cared as much as us.",
  },
  {
    year: "Now",
    emoji: "🌱",
    title: "Still At It",
    desc: "The coop is mostly upright. The chickens are fat and happy. We have no idea what we're doing — but we're doing it together.",
  },
];

const faqs = [
  {
    q: "Are you actual farmers?",
    a: "No. We have regular jobs. We just also happen to have chickens in the backyard and strong opinions about compost.",
  },
  {
    q: "Do you actually know what you're doing?",
    a: "Marginally more than when we started. We've kept an ever growing number of chickens alive for over a year, which we consider a major personal achievement.",
  },
  {
    q: "Why are your eggs unwashed?",
    a: "Eggs have a natural coating called the bloom that protects them. Washing removes it. This is the one thing we actually researched before doing, which puts it in a very small category.",
  },
  {
    q: "Can I visit the farm?",
    a: "The chickens are not really available for guests, but we're always open for egg pickup! The chickens will judge you silently from their run.",
  },
  {
    q: "How do I get eggs?",
    a: "We have pickup spots around town — check our Egg Reorder page. We'll warn you: demand sometimes exceeds supply because the hens have their own schedule.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Best Friends First",
    desc: "The co-op only works because we've got each other's backs. Especially when someone has to clean the coop — that job rotates on a strictly fair basis.",
  },
  {
    icon: Hammer,
    title: "Use What You Have",
    desc: "Sustainability isn't about buying new eco-friendly gear. It's about scavenging scrap wood, calling it \"rustic\", and feeling very proud of yourself.",
  },
  {
    icon: Leaf,
    title: "Fail Loudly",
    desc: "We don't do polished influencer content. If the coop door falls off, we tell you. If the feed costs more than expected, we tell you that too.",
  },
  {
    icon: MessageCircle,
    title: "Laugh at the Chaos",
    desc: "Things will go wrong. Chickens will escape. Mud will happen. If you can't laugh about it with your best friend, you're definitely doing it wrong.",
  },
];

export default function About() {
  useSEO({
    title: "Our Story",
    description: "Meet the friends behind Eggsistential Farms — a backyard co-op raising chickens, baking bread, and figuring it out as they go.",
    path: "/about",
  });
  return (
    <div className="min-h-screen bg-background">

      {/* ─── HERO ─── */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl">🐔</div>
          <div className="absolute bottom-10 right-10 text-6xl">🥚</div>
          <div className="absolute top-1/2 right-1/3 text-5xl">🌿</div>
        </div>
        <div className="container px-4 mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-accent font-bold tracking-widest uppercase text-sm mb-4">
              The Actual Story
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
              The Chaos &{" "}
              <span className="text-accent font-display italic">The Chickens</span>
            </h1>
            <div className="w-24 h-2 bg-accent/25 mx-auto rounded-full mb-8" />
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Welcome to Eggsistential Farms. If you're looking for a perfectly curated homestead with influencer aesthetics — you're definitely in the wrong place. If you want two best friends being completely honest about their messy, wonderful backyard co-op — hi, you're home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── ORIGIN STORY ─── */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-3 bg-accent/10 rounded-[2rem] -rotate-1" />
              <img
                src="/images/family-farm.jpg"
                alt="Our co-op life"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/5] rotate-1 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl font-bold text-primary">
                Why "Eggsistential"?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Because raising animals forces you to confront big questions. Where does food come from? Can you actually keep these tiny creatures alive? Why is that chicken staring directly into your soul?
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Also, we've always bonded over terrible puns. The name was settled in about four seconds.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're not trying to be something we're not. We're two best friends in the suburbs who figured out how to raise backyard chickens — mostly through trial and error, very much weighted toward error. This blog, these eggs, this whole operation: it's our honest, unfiltered attempt at living a little more deliberately.
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-2">
                <p className="font-display text-xl text-primary italic leading-snug">
                  "We're not experts. We're two best friends figuring it out one project at a time — usually the hard way, always together."
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-primary">How We Got Here</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              An extremely abbreviated and slightly embarrassing origin story.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border/60 top-0" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`inline-block bg-card border border-border/50 rounded-2xl p-6 shadow-sm max-w-sm ${i % 2 !== 0 ? "md:ml-auto" : ""}`}>
                      <div className="text-3xl mb-3">{item.emoji}</div>
                      <h3 className="font-serif font-bold text-xl text-primary mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold font-display text-xs text-center shrink-0 z-10 shadow-lg">
                    {item.year}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUR VALUES ─── */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-primary">Our Philosophy</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
              Four things we actually believe, not just things that sound good on an about page.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 bg-card p-7 rounded-2xl border border-border/40 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                  <v.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-primary">
              Questions We Actually Get
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Answered with complete honesty, for better or worse.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">
            Come join our chaos.
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Follow along on the blog, grab some eggs, or just say hi. We love hearing from people who are figuring things out, too.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
                Read the Blog <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary rounded-full px-8">
                Say Hello
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="pb-24 container px-4 mx-auto">
        <NewsletterForm />
      </section>
    </div>
  );
}
