import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { submitToNetlifyForm } from "@/lib/netlifyForm";
import { useToast } from "@/hooks/use-toast";

const eggOrderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  preferredDate: z.string().optional(),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  message: z.string().optional(),
});
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, User, Calendar, MapPin, MessageSquare, Info, CheckCircle, Clock, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PICKUP_LOCATIONS as pickupLocations } from "@/data/pickup";
import { EGG_AVAILABILITY } from "@/data/availability";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { PickupInfo } from "@/components/PickupInfo";
import { useSEO } from "@/lib/seo";

const howItWorks = [
  {
    icon: MessageSquare,
    title: "Submit a Request",
    desc: "Fill out the form below with your pickup location and preferred date.",
  },
  {
    icon: Clock,
    title: "We Confirm",
    desc: "We'll text or email you to confirm availability and details. Usually within 24 hours.",
  },
  {
    icon: Truck,
    title: "Pick Up Your Eggs",
    desc: "Swing by your chosen location and grab your freshly laid, (probably) still-warm eggs.",
  },
];

export default function EggReorder() {
  useSEO({
    title: "Order Fresh Eggs",
    description: "Order pasture-raised eggs from Eggsistential Farms — request a pickup near you.",
    path: "/eggs",
  });
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(eggOrderSchema),
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

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await submitToNetlifyForm("egg-order", values);
    },
    onSuccess: () => {
      toast({
        title: "Request Received!",
        description: "We'll be in touch to confirm your order soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Uh oh — something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ─── HEADER ─── */}
      <section className="bg-primary/5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container px-4 mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-5">
            Egg Re-order Hotline
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
            Fresh, pasture-raised eggs from our six very opinionated backyard hens. Available in a beautiful mix of brown, green, and pink.
          </p>

          <div className="flex flex-col items-center gap-2 mb-8">
            <AvailabilityBadge status={EGG_AVAILABILITY.status} />
            {EGG_AVAILABILITY.note && (
              <p className="text-sm text-muted-foreground">{EGG_AVAILABILITY.note}</p>
            )}
          </div>

          <Alert variant="default" className="bg-accent/10 border-accent/30 max-w-md mx-auto text-left">
            <Info className="h-4 w-4 text-accent mt-0.5" />
            <AlertTitle className="text-accent font-bold text-base">Heads Up</AlertTitle>
            <AlertDescription className="text-foreground/80 mt-1">
              Our eggs come <strong>unwashed</strong> by default — that's how they preserve best. If you'd like them washed, just note it in your message.
            </AlertDescription>
          </Alert>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto max-w-4xl py-16">

        {/* ─── HOW IT WORKS ─── */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-primary text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border/40"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-accent font-bold text-sm uppercase tracking-widest mb-2">Step {i + 1}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── PICKUP INFO ─── */}
        <div className="mb-16">
          <PickupInfo />
        </div>

        {/* ─── ORDER FORM ─── */}
        <Card className="border-border/40 shadow-xl bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-3xl">Place Your Order</CardTitle>
            <CardDescription className="text-base">
              Fill out the form below and we'll get back to you to confirm the details. If we're temporarily out — and sometimes we are — we'll let you know right away.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <User className="w-4 h-4 text-muted-foreground" /> First Name
                        </FormLabel>
                        <FormControl>
                          <Input data-testid="input-firstName" placeholder="Jane" {...field} />
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
                          <User className="w-4 h-4 text-muted-foreground" /> Last Name
                        </FormLabel>
                        <FormControl>
                          <Input data-testid="input-lastName" placeholder="Smith" {...field} />
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
                          <Mail className="w-4 h-4 text-muted-foreground" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input data-testid="input-email" type="email" placeholder="jane@example.com" {...field} />
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
                          <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input data-testid="input-phone" placeholder="(601) 555-0000" {...field} />
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
                          <Calendar className="w-4 h-4 text-muted-foreground" /> Preferred Pickup Date
                        </FormLabel>
                        <FormControl>
                          <Input data-testid="input-preferredDate" type="date" {...field} />
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
                          <MapPin className="w-4 h-4 text-muted-foreground" /> Pickup Location
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pickupLocation">
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pickupLocations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
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
                        <MessageSquare className="w-4 h-4 text-muted-foreground" /> Notes / Special Requests
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="input-message"
                          placeholder="I'd like them washed, please! Also, extra blue eggs if you have any."
                          className="min-h-[110px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  data-testid="button-submit-egg-order"
                  className="w-full bg-accent hover:bg-accent/90 text-white h-13 text-lg rounded-xl font-semibold shadow-lg shadow-accent/20 disabled:opacity-50"
                  disabled={mutation.isPending || EGG_AVAILABILITY.status === "sold-out"}
                >
                  {EGG_AVAILABILITY.status === "sold-out" ? (
                    "Currently Sold Out"
                  ) : mutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" /> Submit Order Request
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* ─── TESTIMONIALS ─── */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <blockquote className="italic text-foreground/80 mb-4 leading-relaxed">
              "These eggs changed my breakfast and possibly my outlook on life."
            </blockquote>
            <p className="font-bold text-sm text-primary">— definitely not Matt's mom</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <blockquote className="italic text-foreground/80 mb-4 leading-relaxed">
              "I didn't know pink was an option!"
            </blockquote>
            <p className="font-bold text-sm text-primary">— Kelsey Walsh</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <blockquote className="italic text-foreground/80 mb-4 leading-relaxed">
              "You should charge more."
            </blockquote>
            <p className="font-bold text-sm text-primary">— Jack Moriarity</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <blockquote className="italic text-foreground/80 mb-4 leading-relaxed">
              "Oh, you're actually doing the egg thing."
            </blockquote>
            <p className="font-bold text-sm text-primary">— Will Caves</p>
          </div>
        </div>
      </div>
    </div>
  );
}
