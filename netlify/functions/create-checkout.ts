import type { Context } from "@netlify/functions";
import Stripe from "stripe";
import { products } from "../../src/data/products";
import { SHIPPING_FLAT_RATE_CENTS } from "../../src/data/shipping";

// This function runs on Netlify's servers (not in the visitor's
// browser), so it's safe to keep your Stripe secret key here as an
// environment variable. Set STRIPE_SECRET_KEY in your Netlify site
// settings — see README.md for the exact steps.
//
// This only handles merch (shirts, stickers, mugs, etc. from
// src/data/products.ts) — it never trusts a price sent by the
// browser, always looking up the real price from that file itself.
//
// Eggs, bread, and honey are NOT sold through Stripe. Mississippi
// cottage food law doesn't allow taking payment online for
// home-produced food, so those pages collect an order request only —
// payment (Venmo or cash) is arranged directly at pickup. If that
// law ever changes and you want to revisit this, ask for help adding
// it back in — the pattern here can be reused.
//
// Stripe's checkout page also lets the customer choose Local Pickup
// (free) or Shipping (flat rate from src/data/shipping.ts) and
// collects their shipping address if they pick shipping.

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
    });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(
      JSON.stringify({
        message:
          "Stripe isn't configured yet. Add STRIPE_SECRET_KEY in your Netlify site's environment variables.",
      }),
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = await req.json();
    const { itemId, quantity, size } = body as {
      itemId: string;
      quantity?: number;
      size?: string;
    };

    const qty = Math.min(Math.max(Number(quantity) || 1, 1), 10);
    const origin = req.headers.get("origin") || new URL(req.url).origin;

    const product = products.find((p) => p.id === Number(itemId));
    if (!product || !product.priceCents || product.comingSoon) {
      return new Response(
        JSON.stringify({ message: "That item isn't available for online payment." }),
        { status: 400 },
      );
    }

    // If this product has sizes, a valid, in-stock size is required.
    if (product.sizes && product.sizes.length > 0) {
      if (!size || !product.sizes.includes(size)) {
        return new Response(
          JSON.stringify({ message: "Please choose a size." }),
          { status: 400 },
        );
      }
      if (product.soldOutSizes?.includes(size)) {
        return new Response(
          JSON.stringify({ message: "That size is sold out." }),
          { status: 400 },
        );
      }
    }

    const name = size ? `${product.name} — Size ${size}` : product.name;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: product.priceCents,
          },
          quantity: qty,
        },
      ],
      success_url: `${origin}/shop?success=true`,
      cancel_url: `${origin}/shop`,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Local Pickup (Free)",
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: SHIPPING_FLAT_RATE_CENTS, currency: "usd" },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return new Response(
      JSON.stringify({ message: "Something went wrong creating checkout. Please try again." }),
      { status: 500 },
    );
  }
};
