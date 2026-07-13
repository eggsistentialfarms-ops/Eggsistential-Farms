import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { submitToNetlifyForm } from "@/lib/netlifyForm";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/lib/seo";

const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Please add a subject"),
  message: z.string().min(1, "Please add a message"),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  useSEO({
    title: "Contact Us",
    description: "Get in touch with Eggsistential Farms — questions about eggs, bread, honey, or your own coop are all welcome.",
    path: "/contact",
  });
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => submitToNetlifyForm("contact", data),
    onSuccess: () => {
      toast({ title: "Message sent!", description: "We'll get back to you within a day or two." });
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Uh oh — something went wrong.", description: error.message, variant: "destructive" });
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
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            Don't Be a Stranger
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-5">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have a coop question? Want to share your own farming fail? Or just want to say hi? We genuinely love hearing from people.
          </p>
        </motion.div>
      </section>

      <div className="container px-4 mx-auto max-w-5xl py-20">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* ─── LEFT SIDE INFO ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-10"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-foreground mb-0.5">Email</div>
                  <a
                    href="mailto:hello@eggsistentialfarms.com"
                    className="text-muted-foreground hover:text-accent transition-colors text-sm"
                  >
                    hello@eggsistentialfarms.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-foreground mb-0.5">Location</div>
                  <p className="text-muted-foreground text-sm">
                    Somewhere in the suburbs,<br />running from escaped chickens.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h3 className="font-serif font-bold text-xl mb-5">Follow the flock</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-md shadow-primary/15"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors shadow-md shadow-primary/15"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Real-time updates from the coop — including when the chickens do something ridiculous, which is basically every day.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
              <p className="font-display text-primary leading-snug">
                "No question is too basic. We were all beginners once — and we're still barely intermediate."
              </p>
            </div>
          </motion.div>

          {/* ─── RIGHT SIDE FORM ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3 bg-card p-8 md:p-10 rounded-3xl border border-border/50 shadow-lg shadow-primary/5"
          >
            <h3 className="font-serif font-bold text-2xl mb-2">Send a Message</h3>
            <p className="text-muted-foreground text-sm mb-7">
              We try to respond within a day or two. We're slow but we do care.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">First Name</FormLabel>
                      <FormControl>
                        <Input data-testid="input-contact-name" placeholder="Jane" className="rounded-xl h-11 bg-background border-border/60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input data-testid="input-contact-email" placeholder="jane@example.com" type="email" className="rounded-xl h-11 bg-background border-border/60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Subject</FormLabel>
                    <FormControl>
                      <Input data-testid="input-contact-subject" placeholder="My chicken escaped and I need advice immediately" className="rounded-xl h-11 bg-background border-border/60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea data-testid="input-contact-message" placeholder="Tell us what's on your mind. We promise not to judge." className="rounded-xl min-h-[150px] bg-background border-border/60 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  data-testid="button-send-message"
                  disabled={mutation.isPending}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all"
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
