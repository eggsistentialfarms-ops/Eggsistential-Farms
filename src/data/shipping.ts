// Shipping settings for merch orders. Since you're bulk-ordering and
// holding stock now, customers can choose Local Pickup (free) or
// Shipping (flat rate) right on Stripe's checkout page — no separate
// form needed.
//
// Edit SHIPPING_FLAT_RATE_CENTS any time your actual shipping cost
// changes (e.g. 599 = $5.99). This is a flat rate for simplicity;
// if you ever need different rates per item (heavy vs. light), just
// ask and it can be upgraded to per-product shipping costs.

export const SHIPPING_FLAT_RATE_CENTS = 599;
