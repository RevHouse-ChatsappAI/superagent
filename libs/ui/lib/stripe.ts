import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-08-16",
  appInfo: {
    name: "nextjs-with-stripe-typescript-demo",
    url: "https://nextjs-with-stripe-typescript-demo.vercel.app",
  },
});
