import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getPriceIdForProduct } from "@/lib/products";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

type CheckoutRequestBody = {
  productId?: string;
};

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 500 }
    );
  }

  if (!appUrl) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_APP_URL environment variable." },
      { status: 500 }
    );
  }

  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!body.productId || typeof body.productId !== "string") {
    return NextResponse.json(
      { error: "productId is required." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: getPriceIdForProduct(body.productId),
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe checkout session did not return a redirect URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}