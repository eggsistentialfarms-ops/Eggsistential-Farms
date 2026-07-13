import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitToNetlifyForm } from "@/lib/netlifyForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function NewsletterForm() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => submitToNetlifyForm("newsletter", data),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Welcome to the Flock! 🐔",
          description: "You've successfully subscribed to our chaos.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Uh oh...",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="bg-primary/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
        <Mail className="w-64 h-64 text-primary" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-primary">Join the Flock</h2>
        <p className="text-muted-foreground">
          Sign up for our newsletter to get the latest coop builds, chicken fails, and honest homesteading advice. No spam, just eggs.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            placeholder="Enter your email..."
            {...form.register("email")}
            className="bg-background h-12 rounded-xl border-primary/20 focus:border-primary focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
          </Button>
        </form>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
    </div>
  );
}
