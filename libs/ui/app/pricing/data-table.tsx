"use client"

import React, { useEffect, useState } from "react"
import Stripe from "stripe"

import { Profile } from "@/types/profile"
import { pricingFeatures } from "@/config/pricing"

import { CardPrice } from "./components/CardPrice"
import { CardScheduleLink } from "./components/CardScheduleLink"
import { CalendarIcon } from "@/components/svg/CalendarIcon"
import Link from "next/link"

async function loadPrices() {
  const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error("Stripe secret key is undefined.")
  }
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-08-16",
  })

  const prices = await stripe.prices.list({
    product: 'prod_PQlBLHxNozr0nS'
  });
  const filteredPrices = prices.data.filter(
    (price) =>
      price.nickname === "BASE" ||
      price.nickname === "STANDARD" ||
      price.nickname === "PREMIUM"
  )
  const sortedPrices = filteredPrices.sort((a, b) => {
    const unitAmountA = a.unit_amount || 0
    const unitAmountB = b.unit_amount || 0
    return unitAmountA - unitAmountB
  })

  return sortedPrices
}

export const DataTable = ({ profile }: { profile: Profile }) => {
  const [prices, setPrices] = useState<any[]>([])

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const loadedPrices = await loadPrices()
        setPrices(loadedPrices)
      } catch (error) {
        console.error("Error loading prices:", error)
      }
    }

    fetchPrices()
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-1 flex-row justify-between rounded-lg border border-gray-100 bg-slate-200 p-6 text-start text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold">Agenda una Reunión</h3>
          <p className="text-base font-light text-gray-500 dark:text-gray-400">
            Descubre cómo ChatsAppAI puede ayudarte. ¡Agenda una demostración
            del producto!
          </p>
        </div>
        <div className="flex items-center">
          <Link
            target="_black"
            href="https://cal.com/sebastianrinaldi/chatsappai-basico"
            className="flex w-full items-center justify-start gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            <CalendarIcon />
            <span>Demo Básico</span>
          </Link>
        </div>
      </div>
      <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
        {prices.map((price) => (
          <CardPrice
            key={price.id}
            priceId={price.id}
            title={price.nickname || ""}
            nickname={price.nickname || ""}
            description={getPriceDescription(price)}
            price={`$${price.unit_amount / 100}`}
            features={getFeatures(price)}
            buttonLink="/signup"
            profile={profile}
            uiMode="hosted"
          />
        ))}
      </div>
    </div>
  )
}

function getPriceDescription(price: any): string {
  if (price.unit_amount === 0) {
    return "Explora nuestros servicios con el Plan Gratis, ¡perfecto para empezar!"
  } else if (price.unit_amount < 78900) {
    return "Desbloquea más características con el Plan Estándar, ideal para negocios en crecimiento!"
  } else {
    return "¡Experimenta la suite completa con nuestro Plan Premium, diseñado para escalar!"
  }
}

function getFeatures(price: any): string[] {
  if (price.unit_amount === 0) {
    return pricingFeatures.free
  } else if (price.unit_amount < 78900) {
    return pricingFeatures.standard
  } else {
    return pricingFeatures.premiun
  }
}
