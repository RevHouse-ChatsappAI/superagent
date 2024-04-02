"use client"

import React, { useState } from "react"
import { RxCross2 } from "react-icons/rx"

import { Profile } from "@/types/profile"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useChatwoot } from "@/app/context/ChatwootContext"
import { ProfileChatwoot } from "@/app/dashboard/components/ProfileChatwoot"
import StepFive from "@/app/dashboard/components/step/StepFive"
import StepFour from "@/app/dashboard/components/step/StepFour"
import StepOne from "@/app/dashboard/components/step/StepOne"
import StepThree from "@/app/dashboard/components/step/StepThree"
import StepTwo from "@/app/dashboard/components/step/StepTwo"

import { AccountProfile } from "./AccountProfile"

export const Modal = ({
  profile,
  handleModalClose,
  isTokenActive,
}: {
  profile: Profile
  handleModalClose: () => void
  isTokenActive: boolean
}) => {
  const [currentStep, setCurrentStep] = useState(
    parseInt(localStorage.getItem("currentStep") || "1", 10)
  )

  const nextStep = () => {
    const newStep = currentStep + 1
    setCurrentStep(newStep)
    localStorage.setItem("currentStep", newStep.toString())
  }

  const prevStep = () => {
    const newStep = currentStep - 1
    setCurrentStep(newStep)
    localStorage.setItem("currentStep", newStep.toString())
  }
  return (
    <div className="absolute inset-y-0 end-0 left-0 flex items-center justify-center bg-white/60 dark:bg-black/60">
      <div className="animate__animated animate__fadeIn flex w-[520px] flex-col gap-3 rounded-lg border-2 bg-white p-4 dark:bg-black">
        <div className="flex justify-between border-b py-3 ">
          <h2 className="text-lg text-black dark:text-gray-300">
            {isTokenActive
              ? "Agregar una nueva conexión"
              : "Conectar con ChatsappAI CRM"}
          </h2>
          <button onClick={handleModalClose}>
            <RxCross2 />
          </button>
        </div>
        <div className="flex h-full flex-col gap-3 p-3">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-5">
              {currentStep === 1 && <StepOne nextStep={nextStep} />}
              {currentStep === 2 && (
                <StepTwo nextStep={nextStep} prevStep={prevStep} />
              )}
              {currentStep === 3 && (
                <StepThree
                  nextStep={nextStep}
                  prevStep={prevStep}
                  profile={profile}
                />
              )}
              {currentStep === 4 && (
                <StepFour nextStep={nextStep} prevStep={prevStep} />
              )}
              {currentStep === 5 && (
                <StepFive nextStep={prevStep} profile={profile} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
