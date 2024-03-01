import type { Stripe } from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  // Retrieve the checkout session with the payment intent, line items, and customer details expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['payment_intent', 'line_items', 'customer'],
  });

  // Log the checkout session object for debugging purposes
  console.log('Checkout session object:', checkoutSession);

  // Send the metadata to the backend
  const superagentApiUrl = process.env.NEXT_PUBLIC_SUPERAGENT_API_URL;
  if (!superagentApiUrl) {
    throw new Error('The Superagent API URL is not defined in the environment variables.');
  }

  // The following code has been rewritten to include additional information in the POST request to the backend
  const metadataResponse = await fetch(`${superagentApiUrl}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${checkoutSession.metadata?.api_key}`,
    },
    body: JSON.stringify({
      user_customer_id: checkoutSession.metadata?.user_customer_id,
      nickname: checkoutSession.metadata?.nickname
    }),
  });

  if (!metadataResponse.ok) {
    throw new Error(`HTTP error! Status: ${metadataResponse.status}`);
  }

  const metadataResult = await metadataResponse.json();
  console.log('Metadata sent to backend:', metadataResult);
}


export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          const session = data as Stripe.Checkout.Session;

          console.log(`Session data: ${JSON.stringify(session, null, 2)}`);
          await handleCheckoutSession(session);
          break;
        case "payment_intent.payment_failed":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.succeeded":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data}`);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
