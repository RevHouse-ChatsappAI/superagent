import { headers } from "next/headers";
import { NextResponse } from "next/server"
import Stripe from "stripe"



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  // Retrieve the checkout session with the payment intent, line items, and customer details expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['payment_intent', 'line_items', 'customer'],
  });

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

  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") ?? "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return new NextResponse(JSON.stringify({
        message: `Webhook Error: ${err.message}`,
        ok: false,
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSession(session);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse(null, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return new NextResponse(JSON.stringify({
      message: 'Internal server error',
      ok: false,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
