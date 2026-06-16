import Stripe from "stripe";
import { NextResponse } from "next/server";
import { markFulfilled } from "@/lib/fulfillment-store";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 500 }
    );
  }

  if (!stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET environment variable." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;
  const productId = session.metadata?.productId;

  if (!sessionId || !productId) {
    return NextResponse.json(
      { error: "Missing checkout session id or product metadata." },
      { status: 400 }
    );
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Checkout session is not in paid state." },
      { status: 400 }
    );
  }

  markFulfilled(sessionId, productId);
  return NextResponse.json({ received: true });
}