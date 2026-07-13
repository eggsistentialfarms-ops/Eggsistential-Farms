// Simple availability status for eggs. Unlike bread, eggs aren't
// broken into multiple flavors/items, so this is just one flag you
// can flip whenever the hens slow down or you're fully stocked.
//
// "status": "available" | "limited" | "sold-out"
// "note": optional short message shown under the badge, e.g.
//   "Back in stock Friday" — leave as "" to show nothing extra.

export interface AvailabilityStatus {
  status: "available" | "limited" | "sold-out";
  note?: string;
}

export const EGG_AVAILABILITY: AvailabilityStatus = {
  status: "available",
  note: "",
};
