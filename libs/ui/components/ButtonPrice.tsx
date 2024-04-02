"use client"

import React, { useState } from "react"
import getStripe from "@/utils/get-stripe"
import { formatAmountForDisplay } from "@/utils/stripe-helper"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import Stripe from "stripe"

import * as config from "@/config/"
import { createCheckoutSession } from "@/app/actions/stripe"

interface ButtonPriceProps {
  title: string
  priceId: string
  profile: any
  nickname: string
  uiMode: Stripe.Checkout.SessionCreateParams.UiMode
}

export const ButtonPrice: React.FC<ButtonPriceProps> = ({
  uiMode,
  title,
  priceId,
  profile,
  nickname,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const formAction = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("priceId", priceId)
      formData.append("customer_id", profile.stripe_customer_id)
      formData.append("user_id", profile.user_id)
      formData.append("api_key", profile.api_key)
      formData.append("nickname", nickname)
      formData.append("uiMode", uiMode)

      const { client_secret, url } = await createCheckoutSession(formData)

      if (uiMode === "embedded") {
        setClientSecret(client_secret)
      } else {
        window.open(url as string, "_blank")
      }
    } catch (error) {
      console.error("Checkout session creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="focus:ring-primary-200 dark:focus:ring-primary-900 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-500 focus:ring-4 dark:text-white"
      onClick={formAction}
      disabled={loading}
    >
      {loading ? "Procesando..." : title}
    </button>
  )
}
