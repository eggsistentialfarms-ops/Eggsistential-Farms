import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "cookie-consent";

// Simple, honest cookie banner. Right now this site doesn't actually
// set any tracking cookies (no analytics, no ad tech) — this banner
// exists as good practice and to cover you if you add something like
// Google Analytics later. If you do add an analytics/tracking script
// down the road, only load it when getCookieConsent() === "accepted"
// (see the helper function below) so a "Deny" choice is respected.

export type ConsentValue = "accepted" | "denied" | null;

export function getCookieConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(STORAGE_KEY) as ConsentValue) || null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      // Small delay so it doesn't compete with the page's own load-in animation.
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (value: Exclude<ConsentValue, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-card border border-border/60 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          We use cookies to make this site work well. You can accept or decline —
          declining won't affect your ability to browse or place an order.
        </p>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none rounded-full border-border/60"
            onClick={() => choose("denied")}
            data-testid="button-cookie-deny"
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none rounded-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => choose("accepted")}
            data-testid="button-cookie-accept"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
