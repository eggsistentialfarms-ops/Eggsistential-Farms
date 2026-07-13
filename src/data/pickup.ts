// Single source of truth for pickup locations, used on the Eggs page,
// Bread page, Home page, Shop page, and Footer — so you only ever
// need to update this one file when locations or pickup days change.

export const PICKUP_LOCATIONS = [
  "1820 Bellewood Rd",
  "River Oaks Hospital",
  "St. Dominic's Hospital",
  "Women's Hospital",
  "Surgicare",
  "MSMOC",
  "Cap Ortho",
];

// Edit this however you like — it's shown as a short line of text
// next to the pickup locations. Leave it blank ("") to hide it.
export const PICKUP_DAYS_NOTE = "Pickup days and times vary by location — we'll confirm specifics when we reach out to you.";
