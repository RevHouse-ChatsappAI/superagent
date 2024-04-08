import React from "react"

import { Profile } from "@/types/profile"

// import { ButtonPrice } from "@/components/ButtonPrice"

interface CardPriceProps {
  uiMode: string
  title: string
  description: string
  price: string | number
  features: string[]
  buttonLink: string
  priceId: string
  nickname: string
  profile: Profile
  status: string
}

export const CardPrice: React.FC<CardPriceProps> = ({
  uiMode,
  title,
  description,
  price,
  features,
  buttonLink,
  priceId,
  nickname,
  profile,
  status,
}) => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-between rounded-lg border border-gray-100 bg-slate-200 p-6 text-start text-gray-900 shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8">
      <div>
        <div className="flex items-start gap-3">
          <h3 className="mb-4 text-2xl font-semibold">{nickname}</h3>
          {nickname.toLocaleLowerCase() === "plan pymes" && (
            <span className="rounded-lg bg-blue-400 px-2 py-1 text-xs font-semibold text-white">
              Popular
            </span>
          )}
        </div>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="my-8 flex items-baseline justify-center">
          <span className="mr-2 text-5xl font-extrabold">{price}</span>
          <span className="text-gray-500 dark:text-gray-400">/mes</span>
        </div>
        <ul role="list" className="mb-8 space-y-2 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        {/* <ButtonPrice
          uiMode="hosted"
          nickname={status}
          profile={profile}
          priceId={priceId}
          title="Asignar Pago"
        /> */}
      </div>
    </div>
  )
}
