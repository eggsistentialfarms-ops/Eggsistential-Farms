import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { submitToNetlifyForm } from "@/lib/netlifyForm";
import { useToast } from "@/hooks/use-toast";
import { BREADS, PICKUP_LOCATIONS } from "@/data/bread";
import { useSEO } from "@/lib/seo";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { PickupInfo } from "@/components/PickupInfo";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Phone, Mail, User, Calendar, MapPin, MessageSquare,
  CheckCircle, Clock, Wheat, Info, ArrowRight, ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Bread catalogue and pickup locations now live in src/data/bread.ts
// (shared with the Stripe checkout function so prices always match).

// ─── Form schema (step 1) ──────────────────────────────────────────
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  breadType: z.string().min(1, "Please choose a loaf"),
  quantity: z.coerce.number().int().min(1).max(10),
  preferredDate: z.string().optional(),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  message: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

const howItWorks = [
  { icon: ShoppingBag, step: "1", title: "Choose & Pre-Order", desc: "Pick your loaf and fill out your info to reserve your spot in the weekly bake." },
  { icon: Clock,       step: "2", title: "We Bake, You Wait", desc: "Small batches only. Once the list fills, that's it until next week. We'll confirm your order." },
  { icon: CheckCircle, step: "3", title: "Pick Up Fresh",     desc: "Grab your loaf at your chosen location. Best within 3–5 days. Do NOT refrigerate." },
];

// ─── Component ─────────────────────────────────────────────────────
export default function Bread() {
  useSEO({
    title: "Bread Pre-Orders",
    description: "Pre-order fresh-baked bread from Eggsistential Farms — classic white, whole wheat, and sourdough.",
    path: "/bread",
  });
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "summary" | "special" | "confirmed">("form");
  const [orderData, setOrderData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      breadType: "", quantity: 1, preferredDate: "", pickupLocation: "", message: "",
    },
  });

  const selectedBread = BREADS.find(b => b.label === form.watch("breadType"));
  const qty = Number(form.watch("quantity")) || 1;
  const totalPrice = selectedBread?.price != null ? selectedBread.price * qty : null;

  // ─── Order submission ──────────────────────────────────────────────
  // No online payment for bread — Mississippi cottage food law doesn't
  // allow taking payment over the internet for home-produced food.
  // This just records the order details; payment (Venmo or cash) is
  // arranged in person at pickup.
  const submitOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await submitToNetlifyForm("bread-order", { ...data });
    },
    onSuccess: () => {
      setStep("confirmed");
    },
    onError: (err: Error) => {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    },
  });

  // Step 1 → Step 2
  const handleFormSubmit = (data: FormData) => {
    const bread = BREADS.find(b => b.label === data.breadType);
    if (bread?.price === null) {
      // Weekly special — no online payment, show contact message
      setOrderData(data);
      setStep("special");
      return;
    }
    setOrderData(data);
    setStep("summary");
  };

  const handleConfirmOrder = () => {
    if (!orderData) return;
    submitOrderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ─── HEADER ─── */}
      <section className="py-20 text-center" style={{ backgroundColor: "hsl(25 25% 96%)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container px-4 mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">Bread Pre-Orders</h1>
          <p className="text-xl font-medium text-foreground/80 max-w-xl mx-auto mb-2">No preservatives. Just real bread.</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            We're not a commercial bakery. We're just people who thought raising chickens, building things,
            working full-time jobs, and baking bread every week sounded like a reasonable life choice.
          </p>
          <Alert variant="default" className="bg-accent/10 border-accent/30 max-w-md mx-auto text-left">
            <Info className="h-4 w-4 text-accent mt-0.5" />
            <AlertTitle className="text-accent font-bold">Pre-Order Only</AlertTitle>
            <AlertDescription className="text-foreground/80 mt-1">
              Small batches. Once the weekly bake list fills, that's it until next time.
              Payment (Venmo or cash) is arranged when you pick up your loaf.
            </AlertDescription>
          </Alert>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto max-w-4xl py-16">

        {/* ─── HOW IT WORKS ─── */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-primary text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border/40">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <s.icon className="w-7 h-7" />
                </div>
                <div className="text-accent font-bold text-sm uppercase tracking-widest mb-2">Step {s.step}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── BREAD CARDS ─── */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-primary text-center mb-3">Our Loaves</h2>
          <p className="text-center text-muted-foreground mb-10">
            We always offer our core loaves — check back weekly for special bakes.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {BREADS.map((bread, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`bg-card border rounded-2xl p-6 flex gap-4 items-start transition-all ${
                  bread.price === null ? "border-dashed border-border/50 opacity-75" : "border-border/40 hover:border-primary/30 hover:shadow-md"
                } ${bread.status === "sold-out" ? "opacity-60" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-foreground leading-snug">{bread.label}</h3>
                    {bread.price != null
                      ? <span className="font-serif font-bold text-xl text-accent shrink-0">${bread.price}</span>
                      : <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest shrink-0 mt-1">TBA</span>
                    }
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 mb-3 leading-relaxed">{bread.desc}</p>
                  {bread.status && bread.status !== "available" && (
                    <AvailabilityBadge status={bread.status} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── STORAGE TIPS ─── */}
        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-primary">Storage Tips</h3>
            <ul className="text-muted-foreground text-sm space-y-2 leading-relaxed">
              <li>Best within <strong className="text-foreground">3–5 days</strong></li>
              <li>Keep at room temp in a <strong className="text-foreground">sealed bag</strong> (gallon zip lock)</li>
              <li><strong className="text-foreground">Do not refrigerate</strong> — speeds up staling</li>
              <li>Freeze slices up to <strong className="text-foreground">3 months</strong>, toast or thaw as needed</li>
            </ul>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-primary">How It's Made</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every loaf is mixed, shaped, proofed, and baked by hand. Many of our breads use
              in-home freshly milled flour for better flavor and nutrition. No shortcuts, no preservatives.
            </p>
          </div>
        </div>

        {/* ─── PICKUP INFO ─── */}
        <div className="mb-16">
          <PickupInfo />
        </div>

        {/* ─── STEP 1: ORDER FORM ─── */}
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-border/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl">Place Your Pre-Order</CardTitle>
                  <CardDescription className="text-base">
                    Fill out your details below and we'll confirm your spot and arrange payment when you pick up.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

                      {/* Bread type */}
                      <FormField control={form.control} name="breadType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-base">
                            <Wheat className="w-4 h-4 text-muted-foreground" /> Choose Your Loaf
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-breadType" className="h-12 text-base">
                                <SelectValue placeholder="Select a loaf..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BREADS.filter(b => b.price !== null && b.status !== "sold-out").map(b => (
                                <SelectItem key={b.label} value={b.label}>
                                  {b.label} — ${b.price}{b.status === "limited" ? " (limited)" : ""}
                                </SelectItem>
                              ))}
                              <SelectItem value="Weekly Special Bake — check announcement">
                                Weekly Special Bake — check announcement
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {/* Quantity */}
                      <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">How Many Loaves?</FormLabel>
                          <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                            <FormControl>
                              <SelectTrigger data-testid="select-quantity">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1,2,3,4,5].map(n => (
                                <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "loaf" : "loaves"}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {/* Live price preview */}
                      {totalPrice != null && (
                        <div className="flex items-center justify-between bg-primary/5 border border-primary/15 rounded-xl px-5 py-3">
                          <span className="text-foreground/80 font-medium">Estimated Total</span>
                          <span className="font-serif font-bold text-2xl text-accent">${totalPrice.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><User className="w-4 h-4 text-muted-foreground" />First Name</FormLabel>
                            <FormControl><Input data-testid="input-bread-firstName" placeholder="Jane" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><User className="w-4 h-4 text-muted-foreground" />Last Name</FormLabel>
                            <FormControl><Input data-testid="input-bread-lastName" placeholder="Smith" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><Mail className="w-4 h-4 text-muted-foreground" />Email</FormLabel>
                            <FormControl><Input data-testid="input-bread-email" type="email" placeholder="jane@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><Phone className="w-4 h-4 text-muted-foreground" />Phone</FormLabel>
                            <FormControl><Input data-testid="input-bread-phone" placeholder="(601) 555-0000" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="preferredDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><Calendar className="w-4 h-4 text-muted-foreground" />Preferred Pickup Date</FormLabel>
                            <FormControl><Input data-testid="input-bread-preferredDate" type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="pickupLocation" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 font-medium"><MapPin className="w-4 h-4 text-muted-foreground" />Pickup Location</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-breadPickupLocation">
                                  <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PICKUP_LOCATIONS.map(loc => (
                                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium"><MessageSquare className="w-4 h-4 text-muted-foreground" />Notes / Questions</FormLabel>
                          <FormControl>
                            <Textarea data-testid="input-bread-message" placeholder="Allergies, questions about the weekly special, anything else..." className="min-h-[90px] resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <Button type="submit" data-testid="button-bread-next" className="w-full h-13 text-lg rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20">
                        Review &amp; Pay <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ─── STEP 2: ORDER SUMMARY + PAY ─── */}
          {step === "summary" && orderData && (
            <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-border/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl">Order Summary</CardTitle>
                  <CardDescription className="text-base">
                    Double-check your order, then click Pay Now to complete your pre-order securely via Stripe.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                  {/* Summary table */}
                  <div className="bg-secondary/30 rounded-2xl p-6 space-y-3">
                    {[
                      { label: "Name", value: `${orderData.firstName} ${orderData.lastName}` },
                      { label: "Email", value: orderData.email },
                      { label: "Phone", value: orderData.phone },
                      { label: "Loaf", value: orderData.breadType },
                      { label: "Quantity", value: `${orderData.quantity} ${orderData.quantity === 1 ? "loaf" : "loaves"}` },
                      { label: "Pickup Location", value: orderData.pickupLocation },
                      ...(orderData.preferredDate ? [{ label: "Preferred Date", value: orderData.preferredDate }] : []),
                      ...(orderData.message ? [{ label: "Notes", value: orderData.message }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4 text-sm">
                        <span className="text-muted-foreground font-medium shrink-0">{label}</span>
                        <span className="text-foreground text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-6 py-5">
                    <div>
                      <p className="text-primary-foreground/70 text-sm uppercase tracking-widest">Amount Due at Pickup</p>
                      <p className="font-serif text-4xl font-bold">${totalPrice?.toFixed(2)}</p>
                    </div>
                    <div className="text-right text-primary-foreground/70 text-sm">
                      <p>Venmo or cash</p>
                      <p>arranged at pickup</p>
                    </div>
                  </div>

                  {/* Payment note */}
                  <Alert className="border-border/40 bg-secondary/30">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <AlertTitle className="font-semibold text-foreground">How You'll Pay</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      We don't take payment online — once we confirm your order, we'll arrange Venmo
                      or cash payment with you directly at pickup. Questions in the meantime? Reach us at{" "}
                      <a href="mailto:hello@eggsistentialfarms.com" className="text-accent underline font-medium">
                        hello@eggsistentialfarms.com
                      </a>.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => setStep("form")} className="sm:w-auto w-full rounded-xl h-12 border-border/60">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                    </Button>
                    <Button
                      data-testid="button-submit-order"
                      onClick={handleConfirmOrder}
                      disabled={submitOrderMutation.isPending}
                      className="flex-1 h-12 text-lg rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20"
                    >
                      {submitOrderMutation.isPending ? (
                        "Submitting..."
                      ) : (
                        <><CheckCircle className="w-5 h-5 mr-2" /> Submit Pre-Order</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ─── CONFIRMED: order submitted, payment arranged at pickup ─── */}
          {step === "confirmed" && orderData && (
            <motion.div key="confirmed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-border/40 shadow-xl text-center">
                <CardContent className="pt-12 pb-10 px-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-primary">Your Pre-Order Is In!</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                    Thanks, {orderData.firstName}! We'll reach out to confirm your order and arrange
                    Venmo or cash payment when you pick up your loaf at {orderData.pickupLocation}.
                  </p>
                  <Button onClick={() => { setStep("form"); setOrderData(null); form.reset(); }} variant="outline" className="rounded-xl h-11 border-border/60">
                    Place Another Order
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ─── SPECIAL BAKE: contact instead of pay ─── */}
          {step === "special" && orderData && (
            <motion.div key="special" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-border/40 shadow-xl text-center">
                <CardContent className="pt-12 pb-10 px-8 space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-primary">Weekly Special — Contact Us</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                    Weekly specials aren't available for online pre-order since the price and type vary each week.
                    Shoot us an email and we'll get you sorted!
                  </p>
                  <a
                    href={`mailto:hello@eggsistentialfarms.com?subject=Weekly Special Bake Inquiry — ${orderData.firstName} ${orderData.lastName}&body=Hi! I'm interested in the weekly special bake. My pickup location is ${orderData.pickupLocation}.`}
                    className="inline-flex"
                  >
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
                      <Mail className="w-4 h-4 mr-2" /> Email Us About the Special
                    </Button>
                  </a>
                  <div className="pt-2">
                    <Button variant="link" onClick={() => setStep("form")} className="text-muted-foreground">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FOOTER NOTE ─── */}
        <div className="mt-10 bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
          <p className="font-display text-primary text-lg mb-1">
            "We will always offer our core loaves — check back weekly for special bakes."
          </p>
          <p className="text-muted-foreground text-sm">
            Once the bake list fills, that's it until next week. Early birds get the bread.
          </p>
        </div>
      </div>
    </div>
  );
}
