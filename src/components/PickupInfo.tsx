import { MapPin } from "lucide-react";
import { PICKUP_LOCATIONS, PICKUP_DAYS_NOTE } from "@/data/pickup";

export function PickupInfo() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-primary">Where to Pick Up</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mb-4">
        {PICKUP_LOCATIONS.map((loc) => (
          <div key={loc} className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            {loc}
          </div>
        ))}
      </div>
      {PICKUP_DAYS_NOTE && (
        <p className="text-sm text-muted-foreground leading-relaxed">{PICKUP_DAYS_NOTE}</p>
      )}
    </div>
  );
}
