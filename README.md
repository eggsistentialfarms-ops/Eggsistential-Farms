# Eggsistential Farms — Website

This is your website, rebuilt so it's free to host, doesn't need a database
or login system, and takes real payments through **Stripe** for bread
pre-orders and any shop items you choose to sell directly.

No coding experience is assumed below — just follow the steps in order.

---

## What changed from the Replit version

- **No database.** Blog posts and shop products now live in two simple
  files you can edit yourself: `src/data/blogPosts.ts` and
  `src/data/products.ts`.
- **No login system.** The old "Replit Auth" admin login has been removed.
- **Payments go through Stripe** instead of Whop. Bread pre-orders
  (`/bread`) and any shop product with a price take real payment via a
  secure Stripe checkout page.
- **Forms (newsletter, contact, egg orders)** are handled by Netlify's
  free built-in form service — no database needed, submissions show up
  in your Netlify dashboard and can email you automatically.

---

## Part 1 — Put this on GitHub

Netlify deploys from a GitHub repository, so first the code needs a home there.

1. Go to [github.com](https://github.com) and create a free account if you
   don't have one.
2. Click the **+** in the top right → **New repository**. Name it
   something like `eggsistential-farms`. Keep it Private or Public, your
   choice. Click **Create repository**.
3. On the new repo's page, click **uploading an existing file** and drag
   in everything from this project folder (or, if you're comfortable with
   git, `git init`, `git add .`, `git commit`, and push it — either works).

---

## Part 2 — Deploy to Netlify (free hosting)

1. Go to [netlify.com](https://netlify.com) and sign up (you can sign up
   directly with your GitHub account, which is easiest).
2. Click **Add a new site → Import an existing project**.
3. Choose **GitHub** and select the repository you just created.
4. Netlify should auto-detect the build settings from the included
   `netlify.toml` file (build command `npm run build`, publish folder
   `dist`). Just click **Deploy**.
5. Wait a minute or two — Netlify will install everything and build your
   site. When it's done, you'll get a free `something.netlify.app` link
   you can click to see your live site.

### Connect your own domain
In your new Netlify site, go to **Domain settings → Add a domain**, type
in your domain, and follow the instructions to point your domain's DNS
to Netlify. This part is free — you only pay for the domain itself
(which you likely already own).

### Turn on form notifications (optional but recommended)
Go to **Site settings → Forms → Form notifications** in Netlify and add
your email so you get notified whenever someone submits the newsletter,
contact, egg order, or bread order forms.

---

## Part 3 — Set up Stripe (for merch payments)

Stripe is only used for **merch** (shirts, stickers, mugs, coop plans).
Eggs, bread, and honey are collected as order requests and paid via
Venmo/cash at pickup instead — see "Payments" further down for why.

1. Go to [stripe.com](https://stripe.com) and create a free account.
   You'll need to fill in some business details before you can accept
   live payments — Stripe walks you through this.
2. In the Stripe Dashboard, go to **Developers → API keys**.
3. Copy the key called **Secret key** (starts with `sk_live_...` once
   your account is activated, or `sk_test_...` while testing).
4. In Netlify, go to your site → **Site settings → Environment
   variables → Add a variable**:
   - Key: `STRIPE_SECRET_KEY`
   - Value: paste the key you copied
5. Redeploy the site (Netlify → **Deploys → Trigger deploy**) so the new
   key takes effect.

That's it — no need to create individual "products" inside Stripe. The
checkout function reads prices directly from `src/data/products.ts`,
so changing a price there is all you need to do.

**Test before going live:** Stripe gives you test API keys and test
credit card numbers (e.g. `4242 4242 4242 4242`, any future expiry, any
CVC) so you can try the full checkout flow without moving real money.
Switch to your live secret key in Netlify once you're ready to accept
real payments.

---

## Part 4 — Editing content yourself

### Blog posts
Open `src/data/blogPosts.ts`. Each post is one entry in a list — copy an
existing one, give it a new `id` and `slug`, and change the `title`,
`excerpt`, `content`, and `coverImage`. Save, commit/upload the change to
GitHub, and Netlify automatically rebuilds and republishes the site
within a minute or two.

### Shop products
Open `src/data/products.ts`. Same idea:
- For something you sell yourself and want paid for on your site, set
  `priceCents` (e.g. `1999` = $19.99) and leave out `affiliateLink`.
- For something you just want to link out to (like an Amazon product),
  set `affiliateLink` and leave out `priceCents`.
- For shirts or anything with sizes, add `sizes: ["S", "M", "L", "XL"]`.
  Customers pick a size before buying. If a size sells out, add it to
  `soldOutSizes` (e.g. `soldOutSizes: ["M"]`) and it'll show crossed
  out but stay visible — remove it from that list once restocked.

### Shipping
Open `src/data/shipping.ts` — one number, `SHIPPING_FLAT_RATE_CENTS`,
controls the flat shipping rate customers see at checkout. They always
get the choice between that and free Local Pickup right on Stripe's
checkout page — no extra form needed on your end. Note: Stripe still
asks for a shipping address even if someone picks Local Pickup — that's
a Stripe quirk, not a bug; it doesn't cost them anything either way.

### Bread pre-order menu and prices
Open `src/data/bread.ts` — this is the one place bread prices live.
Since bread doesn't take online payment (see "Payments" below), this
is just what's shown to customers on the page.

### Pickup locations
Also in `src/data/bread.ts` (`PICKUP_LOCATIONS`) — the egg order page
uses its own copy near the top of `src/pages/EggReorder.tsx`.

If any of this ever feels intimidating, you can paste the file into a
future Claude chat and ask for help making the exact change you want —
you don't have to do this alone.

---

## Local development (optional)

If you want to preview changes on your own computer before publishing:

```bash
npm install
npm run dev
```

This starts a local preview server. Note: the Stripe checkout buttons
won't work locally unless you also run `netlify dev` (Netlify's CLI,
`npm install -g netlify-cli`) instead of `npm run dev`, since that's
what runs the checkout function locally too.

---

## A note on limitations

- The old admin login and "add post/product from the website" button
  have been removed — editing content now happens by editing the data
  files above. This is intentional: it removes an entire login system
  you'd otherwise have to maintain and secure.
- Netlify's free tier includes generous limits for a site like this
  (bandwidth, form submissions, function calls). If the farm business
  takes off and you outgrow the free tier, Netlify will notify you well
  before anything breaks.

---

## Under Construction mode (currently active)

Right now, only the **Eggs** (`/eggs`) and **Bread** (`/bread`) pages are
live — every other page (Home, Shop, About, Blog, Contact) shows a
friendly "Under Construction" placeholder that points visitors to
those two working pages instead.

**To bring a page back when it's ready:** open `src/App.tsx`. Near the
top, you'll see commented-out import lines for each page (e.g.
`// import Home from "@/pages/Home";`). Uncomment the one you want,
then find its `<Route>` line further down and swap the
`<UnderConstruction ... />` for the real page component, e.g.:

```jsx
// before:
<Route path="/" component={() => <UnderConstruction />} />
// after:
<Route path="/" component={Home} />
```

Do that one page at a time as each is ready — no need to bring
everything back at once.

---

## Payments — eggs, bread, and honey vs. merch

Only **merch** (shirts, stickers, mugs, coop plans — from
`src/data/products.ts`) takes payment through Stripe.

**Eggs, bread, and honey do not take online payment.** Mississippi
cottage food law doesn't allow taking payment over the internet for
home-produced food, so those pages just collect an order request —
payment (Venmo or cash) is arranged directly with the customer at
pickup. This is a legal-compliance decision, not a technical
limitation — if the law changes or your situation changes, the old
Stripe pattern can be re-added; just ask.

---

## Cookie consent

A small banner (bottom of the screen, first visit only) lets visitors
accept or decline cookies — see `src/components/CookieConsent.tsx`.
Right now the site doesn't actually set any tracking cookies (no
analytics installed), so this is here as good practice and to cover
you if you add something like Google Analytics later. If you do add
a tracking script down the road, only load it when
`getCookieConsent() === "accepted"` (a helper exported from that same
file) so a "Decline" choice is actually respected.

One honest note: I'm not a lawyer, and this banner is a reasonable
technical implementation, not legal advice. If cookie/privacy
compliance matters a lot to your business, it's worth a quick check
with someone qualified — especially before adding any real tracking
or analytics tool.

---

## Keeping the site private until you're ready to launch

Two layers, both free:

1. **Don't point your domain at Netlify yet.** As long as your domain's
   DNS still points at Squarespace, your real domain keeps showing the
   old site. This new site only exists at its random `*.netlify.app`
   address in the meantime.
2. **Password-gate that `*.netlify.app` address too**, so even someone
   who stumbles on the link can't see it. I've added a file called
   `public/_headers` that does exactly this for free (Netlify's fancier
   built-in "password protect" toggle is a paid feature, but this
   accomplishes the same thing). Open that file, and change
   `farmpreview` and `changeme123` to your own username and password
   before sharing the preview link with anyone.

**When you're ready to actually go live:**
1. Delete `public/_headers` (or just delete the two lines inside it),
   commit the change, and let Netlify redeploy.
2. Then follow the domain-switch steps to point your real domain at
   Netlify (see the earlier conversation, or just ask again — happy to
   walk through it whenever you're ready).

---

## SEO — getting found on Google

Every page now has a real title, description, and social-preview
image, plus `robots.txt`, `sitemap.xml`, and basic structured data
telling Google this is a local food business. A few things to
actually finish, once your domain is connected:

1. **Update the placeholder domain.** I used
   `https://www.eggsistentialfarms.com` as a placeholder in four
   places — search each file for that text and replace it with your
   real domain:
   - `src/lib/seo.ts` (the `SITE_URL` constant)
   - `index.html` (inside the structured data script)
   - `public/robots.txt`
   - `public/sitemap.xml`

2. **Set up Google Search Console** (free, at
   search.google.com/search-console) — this is what actually tells
   Google "please crawl this site" and gives you real data on how
   you're showing up in search. It'll give you a verification code to
   paste into the commented-out line near the top of `index.html`.

3. **Set up a free Google Business Profile** (business.google.com) —
   for a local shop like yours, this matters *more* than almost
   anything on the website itself. It's what makes you show up in
   Google Maps and the "local pack" (the map + 3 listings that show
   above regular search results for things like "eggs near me"). Add
   your pickup info, photos, and hours there.

4. **Honest expectations:** none of this guarantees a top ranking —
   that also depends on content quality, other sites linking to you,
   reviews, and how established your domain becomes over time. What
   this work does is remove the technical barriers that were
   completely blocking you before (no title tag, nothing for Google
   or Facebook to read). Consider it "no longer invisible," not
   "guaranteed page one."

5. **If you want the strongest possible technical foundation later:**
   this site currently renders in the visitor's browser via
   JavaScript (Google handles this fine, but it's slightly slower and
   less universally supported than plain HTML). A future upgrade path
   is "prerendering" — generating real static HTML for each page at
   build time — which is doable without changing your free hosting,
   but is a bigger project. Not necessary to get started; worth
   revisiting if SEO becomes a bigger priority down the line.

