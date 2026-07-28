import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BREADS, PICKUP_LOCATIONS } from "@/data/bread";
import { useSEO } from "@/lib/seo";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { PickupInfo } from "@/components/PickupInfo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  preferredDate: z.string().optional(),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type CartItem = {
  label: string;
  price: number;
  quantity: number;
};

const howItWorks = [
  {
    icon: ShoppingBag,
    step: "1",
    title: "Build Your Preorder",
    desc: "Add one or more loaves to your preorder basket.",
  },
  {
    icon: Clock,
    step: "2",
    title: "We Confirm & Bake",
    desc: "We'll confirm availability and reserve your place in the weekly bake.",
  },
  {
    icon: CheckCircle,
    step: "3",
    title: "Pick Up Fresh",
    desc: "Pay by Venmo or cash when you pick up your bread.",
  },
];

export default function Bread() {
  useSEO({
    title: "Bread Pre-Orders",
    description:
      "Pre-order fresh-baked bread from Eggsistential Farms — classic white, whole wheat, and sourdough.",
    path: "/bread",
  });

  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "summary" | "confirmed">("form");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<FormData | null>(null);
  const [addedLabel, setAddedLabel] = useState<string | null>(null);
  const basketRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preferredDate: "",
      pickupLocation: "",
      message: "",
    },
  });


  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem("eggsistential-bread-preorder");
      if (!savedCart) return;

      const parsed = JSON.parse(savedCart) as CartItem[];
      if (Array.isArray(parsed)) {
        setCart(
          parsed.filter(
            (item) =>
              typeof item?.label === "string" &&
              typeof item?.price === "number" &&
              typeof item?.quantity === "number" &&
              item.quantity > 0,
          ),
        );
      }
    } catch {
      window.localStorage.removeItem("eggsistential-bread-preorder");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "eggsistential-bread-preorder",
      JSON.stringify(cart),
    );
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (label: string, price: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.label === label);
      if (existing) {
        return current.map((item) =>
          item.label === label
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item,
        );
      }
      return [...current, { label, price, quantity: 1 }];
    });

    setAddedLabel(label);
    window.setTimeout(() => {
      setAddedLabel((current) => (current === label ? null : current));
    }, 1200);

    toast({
      title: "Added to preorder",
      description: `${label} was added to your basket.`,
    });
  };

  const updateQuantity = (label: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.label !== label));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.label === label
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item,
      ),
    );
  };

  const removeFromCart = (label: string) => {
    setCart((current) => current.filter((item) => item.label !== label));
  };

  const orderItemsText = cart
    .map(
      (item) =>
        `${item.quantity} × ${item.label} — $${(
          item.price * item.quantity
        ).toFixed(2)}`,
    )
    .join("\n");

  const submitOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/.netlify/functions/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderType: "Bread",
          customerName: `${data.firstName} ${data.lastName}`.trim(),
          customerEmail: data.email,
          customerPhone: data.phone,
          breadType: orderItemsText,
          quantity: cartCount,
          estimatedTotal: `$${totalPrice.toFixed(2)}`,
          preferredDate: data.preferredDate,
          pickupLocation: data.pickupLocation,
          notes: data.message,
        }),
      });

      let result: { success?: boolean; message?: string };

      try {
        result = await response.json();
      } catch {
        throw new Error(
          `The order service returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your bread preorder.",
        );
      }

      return result;
    },
    onSuccess: () => setStep("confirmed"),
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (data: FormData) => {
    if (cart.length === 0) {
      toast({
        title: "Your preorder basket is empty",
        description: "Add at least one loaf before reviewing your order.",
        variant: "destructive",
      });
      return;
    }

    setOrderData(data);
    setStep("summary");
  };

  const handleConfirmOrder = () => {
    if (!orderData || cart.length === 0) return;
    submitOrderMutation.mutate(orderData);
  };

  const scrollToBasket = () => {
    (basketRef.current ?? formRef.current)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const resetOrder = () => {
    setCart([]);
    setOrderData(null);
    setStep("form");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <section
        className="py-20 text-center"
        style={{ backgroundColor: "hsl(25 25% 96%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container px-4 mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
            Bread Pre-Orders
          </h1>
          <p className="text-xl font-medium text-foreground/80 max-w-xl mx-auto mb-2">
            No preservatives. Just real bread.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            We're not a commercial bakery. We're just people who thought
            raising chickens, building things, working full-time jobs, and
            baking bread every week sounded like a reasonable life choice.
          </p>
          <Alert className="bg-accent/10 border-accent/30 max-w-md mx-auto text-left">
            <Info className="h-4 w-4 text-accent mt-0.5" />
            <AlertTitle className="text-accent font-bold">
              Preorder Only
            </AlertTitle>
            <AlertDescription className="text-foreground/80 mt-1">
              Add bread to your preorder basket below. No payment is collected
              online; Venmo or cash is arranged at pickup.
            </AlertDescription>
          </Alert>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto max-w-6xl py-16">
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-primary text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border/40"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-accent font-bold text-sm uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start mb-16">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary text-center lg:text-left mb-3">
              Our Loaves
            </h2>
            <p className="text-muted-foreground text-center lg:text-left mb-8">
              Add as many different loaves as you need to one preorder.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {BREADS.map((bread, index) => {
                const canOrder =
                  bread.price !== null && bread.status !== "sold-out";
                const inCart = cart.find((item) => item.label === bread.label);

                return (
                  <motion.div
                    key={bread.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className={`bg-card border rounded-2xl p-6 flex flex-col transition-all ${
                      bread.price === null
                        ? "border-dashed border-border/50"
                        : "border-border/40 hover:border-primary/30 hover:shadow-md"
                    } ${bread.status === "sold-out" ? "opacity-60" : ""}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-foreground leading-snug">
                          {bread.label}
                        </h3>
                        {bread.price !== null ? (
                          <span className="font-serif font-bold text-xl text-accent shrink-0">
                            ${bread.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest shrink-0 mt-1">
                            TBA
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm mt-2 mb-3 leading-relaxed">
                        {bread.desc}
                      </p>

                      {bread.status && bread.status !== "available" && (
                        <div className="mb-4">
                          <AvailabilityBadge status={bread.status} />
                        </div>
                      )}
                    </div>

                    {canOrder ? (
                      <Button
                        type="button"
                        onClick={() => addToCart(bread.label, bread.price)}
                        className="w-full rounded-xl bg-accent hover:bg-accent/90 text-white"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {addedLabel === bread.label ? (
                            <motion.span
                              key="added"
                              initial={{ opacity: 0, y: 6, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.95 }}
                              className="inline-flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Added!
                            </motion.span>
                          ) : (
                            <motion.span
                              key="add"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="inline-flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {inCart ? "Add Another" : "Add to Preorder"}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    ) : bread.price === null ? (
                      <a
                        href={`mailto:eggsistentialfarms@gmail.com?subject=${encodeURIComponent(
                          `Weekly Special Bake Inquiry — ${bread.label}`,
                        )}`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-xl"
                        >
                          <Mail className="w-4 h-4 mr-2" /> Ask About This Bake
                        </Button>
                      </a>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="w-full rounded-xl"
                      >
                        Sold Out
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div ref={basketRef} className="scroll-mt-24">
          <Card className="border-border/40 shadow-lg lg:sticky lg:top-24">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-accent" /> Preorder
                  Basket
                </span>
                <span className="text-sm font-sans bg-primary/10 text-primary rounded-full px-3 py-1">
                  {cartCount} {cartCount === 1 ? "loaf" : "loaves"}
                </span>
              </CardTitle>
              <CardDescription>
                Payment is due at pickup. Nothing is charged online.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-xl">
                  <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="font-medium">Your basket is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add bread from the loaf cards.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.label}
                      className="border-b border-border/50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between gap-3 mb-3">
                        <div>
                          <p className="font-medium leading-snug">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <p className="font-bold text-accent shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label={`Decrease ${item.label}`}
                            onClick={() =>
                              updateQuantity(item.label, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="w-7 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label={`Increase ${item.label}`}
                            onClick={() =>
                              updateQuantity(item.label, item.quantity + 1)
                            }
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${item.label}`}
                          onClick={() => removeFromCart(item.label)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-medium">Estimated amount due at pickup</span>
                <span className="font-serif text-2xl font-bold text-accent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                type="button"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                disabled={cart.length === 0}
                onClick={() =>
                  document
                    .getElementById("bread-preorder-form")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Continue to Preorder Form
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-primary">
              Storage Tips
            </h3>
            <ul className="text-muted-foreground text-sm space-y-2 leading-relaxed">
              <li>
                Best within <strong className="text-foreground">3–5 days</strong>
              </li>
              <li>
                Keep at room temperature in a{" "}
                <strong className="text-foreground">sealed bag</strong>
              </li>
              <li>
                <strong className="text-foreground">Do not refrigerate</strong> —
                it speeds up staling
              </li>
              <li>
                Freeze slices for up to{" "}
                <strong className="text-foreground">3 months</strong>
              </li>
            </ul>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-primary">
              How It's Made
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every loaf is mixed, shaped, proofed, and baked by hand. Many of
              our breads use freshly milled flour for better flavor and
              nutrition. No shortcuts, no preservatives.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <PickupInfo />
        </div>

        <div id="bread-preorder-form" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-border/40 shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-serif text-3xl">
                      Complete Your Preorder
                    </CardTitle>
                    <CardDescription className="text-base">
                      Your basket automatically appears below. Add your contact
                      and pickup details, then review the order before sending.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/30 rounded-2xl p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Your Bread</h3>
                        <span className="font-serif font-bold text-xl text-accent">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {cart.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Your preorder basket is empty. Add at least one loaf
                          above before submitting.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {cart.map((item) => (
                            <div
                              key={item.label}
                              className="flex justify-between gap-4 text-sm"
                            >
                              <span>
                                {item.quantity} × {item.label}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  First Name
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  Last Name
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="jane@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  Phone
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="(601) 555-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="preferredDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  Preferred Pickup Date
                                </FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pickupLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 font-medium">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  Pickup Location
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {PICKUP_LOCATIONS.map((location) => (
                                      <SelectItem
                                        key={location}
                                        value={location}
                                      >
                                        {location}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-medium">
                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                Notes / Questions
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Allergies, pickup questions, or anything else..."
                                  className="min-h-[90px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={cart.length === 0}
                          className="w-full h-12 text-lg rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20"
                        >
                          Review Preorder
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "summary" && orderData && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-border/40 shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-serif text-3xl">
                      Review Your Preorder
                    </CardTitle>
                    <CardDescription className="text-base">
                      Double-check everything before sending. No online payment
                      will be collected.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="bg-secondary/30 rounded-2xl p-6 space-y-3">
                      <div className="space-y-2 pb-4 border-b border-border/50">
                        {cart.map((item) => (
                          <div
                            key={item.label}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <span>
                              {item.quantity} × {item.label}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {[
                        {
                          label: "Name",
                          value: `${orderData.firstName} ${orderData.lastName}`,
                        },
                        { label: "Email", value: orderData.email },
                        { label: "Phone", value: orderData.phone },
                        {
                          label: "Pickup Location",
                          value: orderData.pickupLocation,
                        },
                        ...(orderData.preferredDate
                          ? [
                              {
                                label: "Preferred Date",
                                value: orderData.preferredDate,
                              },
                            ]
                          : []),
                        ...(orderData.message
                          ? [{ label: "Notes", value: orderData.message }]
                          : []),
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <span className="text-muted-foreground font-medium shrink-0">
                            {label}
                          </span>
                          <span className="text-foreground text-right">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-6 py-5">
                      <div>
                        <p className="text-primary-foreground/70 text-sm uppercase tracking-widest">
                          Estimated Due at Pickup
                        </p>
                        <p className="font-serif text-4xl font-bold">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right text-primary-foreground/70 text-sm">
                        <p>Venmo or cash</p>
                        <p>No online payment</p>
                      </div>
                    </div>

                    <Alert className="border-border/40 bg-secondary/30">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <AlertTitle className="font-semibold text-foreground">
                        This Is a Preorder Request
                      </AlertTitle>
                      <AlertDescription className="text-muted-foreground">
                        We'll contact you to confirm availability, pickup
                        details, and payment arrangements.
                      </AlertDescription>
                    </Alert>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("form")}
                        className="sm:w-auto w-full rounded-xl h-12 border-border/60"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleConfirmOrder}
                        disabled={submitOrderMutation.isPending}
                        className="flex-1 h-12 text-lg rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20"
                      >
                        {submitOrderMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" /> Submit
                            Preorder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "confirmed" && orderData && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-border/40 shadow-xl text-center">
                  <CardContent className="pt-12 pb-10 px-8 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-primary">
                      Your Preorder Is In!
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                      Thanks, {orderData.firstName}! We'll contact you to confirm
                      the {cartCount === 1 ? "loaf" : `${cartCount} loaves`} in
                      your preorder and arrange pickup at{" "}
                      {orderData.pickupLocation}.
                    </p>
                    <Button
                      type="button"
                      onClick={resetOrder}
                      variant="outline"
                      className="rounded-xl h-11 border-border/60"
                    >
                      Place Another Preorder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
          <p className="font-display text-primary text-lg mb-1">
            "We will always offer our core loaves — check back weekly for
            special bakes."
          </p>
          <p className="text-muted-foreground text-sm">
            Once the bake list fills, that's it until next week. Early birds get
            the bread.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {cartCount > 0 && step === "form" && (
          <motion.button
            type="button"
            onClick={scrollToBasket}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            whileTap={{ scale: 0.98 }}
            className="lg:hidden fixed z-50 left-4 right-4 bottom-4 rounded-2xl bg-accent text-white shadow-2xl px-5 py-4 flex items-center justify-between gap-4"
            aria-label="View bread preorder basket"
          >
            <span className="flex items-center gap-3 font-semibold">
              <span className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2.5 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-white text-accent text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              </span>
              View Preorder Basket
            </span>
            <span className="font-serif font-bold text-lg">
              ${totalPrice.toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
