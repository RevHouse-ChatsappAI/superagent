"use client"

import React, { useState } from "react"
import { RxCross2 } from "react-icons/rx"

import { Profile } from "@/types/profile"
import StepFive from "@/app/dashboard/components/step/StepFive"
import StepFour from "@/app/dashboard/components/step/StepFour"
import StepOne from "@/app/dashboard/components/step/StepOne"
import StepThree from "@/app/dashboard/components/step/StepThree"
import StepTwo from "@/app/dashboard/components/step/StepTwo"

export const Modal = ({ profile, handleModalClose }: { profile: Profile, handleModalClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }
  const prevStep = () => setCurrentStep(currentStep - 1)
  return (
    <div className="bg-white-100 absolute inset-y-0 end-0 left-0 flex items-center justify-center">
      <div className="animate__animated animate__fadeInDown flex h-[600px] w-[520px] flex-col gap-3 rounded-3xl border-2 bg-black p-4">
        <div className="flex justify-between border-b p-3 ">
          <h2 className="text-lg text-gray-300">Conectar con chatsappAI</h2>
          <button onClick={handleModalClose}>
            <RxCross2 />
          </button>
        </div>
        <div className="flex h-full flex-col gap-3 p-3">
          <h2 className="text-gray-500 underline underline-offset-2">
            Creación de usuario en chatsappAI
          </h2>
          <div className="flex flex-1 flex-col pt-8">
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
