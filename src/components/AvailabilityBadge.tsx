import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Status = "available" | "limited" | "sold-out";

const config: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  available: {
    label: "Available",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  limited: {
    label: "Limited This Week",
    icon: AlertTriangle,
    className: "bg-accent/10 text-accent border-accent/20",
  },
  "sold-out": {
    label: "Sold Out",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function AvailabilityBadge({ status }: { status: Status }) {
  const { label, icon: Icon, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
