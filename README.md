# Digital Product Store V1

Minimal Next.js + Stripe Checkout app to prove one end-to-end payment flow on localhost.

## V1 Scope

- One hardcoded product on storefront
- One checkout endpoint using Stripe Price ID
- One success page
- One cancel page

Out of scope: database, authentication, webhooks, subscriptions, coupons, cart, order history, and email.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Set real test values:
	- `STRIPE_SECRET_KEY`
	- `STRIPE_PRICE_ID_STARTER`
	- `NEXT_PUBLIC_APP_URL` (keep as `http://localhost:3000` for local)
3. Install dependencies:

```bash
npm install
```

4. Start dev server:

```bash
npm run dev
```

## Test Checklist

1. Open `http://localhost:3000` and confirm product is visible.
2. Click Buy and confirm redirect to Stripe Checkout.
3. Complete payment with Stripe test card and confirm `/success` page.
4. Retry and click cancel on Stripe Checkout and confirm `/cancel` page.
5. Force an invalid request payload to `/api/checkout` and confirm validation error.

## Key Files

- `src/app/page.tsx`: storefront and Buy flow
- `src/app/api/checkout/route.ts`: checkout session creation
- `src/lib/products.ts`: canonical product and Price ID mapping
- `src/app/success/page.tsx`: success destination
- `src/app/cancel/page.tsx`: cancel destination
