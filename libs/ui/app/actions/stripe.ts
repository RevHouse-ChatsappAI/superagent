"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { stripe } from '@/lib/stripe';
import { formatAmountForStripe } from "@/utils/stripe-helper";

export async function createCheckoutSession(
  data: FormData,
): Promise<{ client_secret: string | null; url: string | null }> {
  const ui_mode = data.get(
    "uiMode",
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  const origin: string = headers().get("origin") as string;
  const metadata =  Object.fromEntries(data.entries())

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      metadata: {
        user_customer_id: metadata.customer_id as string,
        user_id: metadata.user_id as string,
        api_key: metadata.api_key as string,
        nickname: metadata.nickname as string
      },
      line_items: [
        {
          price: data.get("priceId") as string,
          quantity: 1,
        },
      ],
      ...(ui_mode === "hosted" && {
        success_url: `${process.env.NEXT_PUBLIC_WEB_HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEB_HOST}/pricing`,
      }),
      ...(ui_mode === "embedded" && {
        return_url: `${process.env.NEXT_PUBLIC_WEB_HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
      }),
      ui_mode,
    });

  return {
    client_secret: checkoutSession.client_secret!,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData,
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get("customDonation") as string),
        CURRENCY,
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  return { client_secret: paymentIntent.client_secret as string };
}
