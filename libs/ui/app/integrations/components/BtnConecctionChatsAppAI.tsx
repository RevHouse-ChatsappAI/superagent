"use client"

import React, { useState } from "react"
import { FaUser } from "react-icons/fa"
import { MdSwitchAccount } from "react-icons/md"
import { SiProbot } from "react-icons/si"

import { Profile } from "@/types/profile"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { AccountProfile } from "./AccountProfile"
import { ProfileChatwoot } from "./ProfileChatwoot"
import StepFive from "./step/StepFive"
import StepFour from "./step/StepFour"
import StepOne from "./step/StepOne"
import StepThree from "./step/StepThree"
import StepTwo from "./step/StepTwo"
import { PlusIcon } from "./svg/PlusIcon"

export const BtnConecctionChatsAppAI = ({
  profile,
  isTokenActive,
}: {
  profile: Profile
  isTokenActive: boolean
  isAvailableExtendChatwoot?: boolean
  setIsAvailableKey?: (value: boolean) => void
}) => {
  const [currentStep, setCurrentStep] = useState(1)

  const { userProfileChatwoot } = useChatwoot()

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }
  const prevStep = () => setCurrentStep(currentStep - 1)
  const isModalOpen = false

  return (
    <Dialog defaultOpen={isModalOpen}>
      <DialogTrigger
        className={
          cn(buttonVariants({ variant: "default", size: "sm" })) +
          "mb-5 flex items-center gap-3 rounded-sm p-3"
        }
      >
        <PlusIcon />
        <p>{isTokenActive ? "Agregar otra conexión" : "Agregar conexión"}</p>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Conexión con ChatsAppAI CRM</DialogTitle>
        <DialogDescription>
          Integre sus canales de comunicación en ChatsAppAI CRM para una gestión
          centralizada y eficiente.
        </DialogDescription>
        <DialogHeader>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">CRM</TabsTrigger>
              <TabsTrigger value="tab2">
                <FaUser className="text-lg" />
              </TabsTrigger>
              <TabsTrigger value="tab3">
                <SiProbot className="text-lg" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="flex h-full flex-col gap-3">
                {isTokenActive ? (
                  <div className="flex flex-1 flex-col pt-3">
                    <div className="flex flex-1 flex-col gap-5">
                      {currentStep === 1 && (
                        <StepTwo
                          btnPrevActive={false}
                          nextStep={nextStep}
                          prevStep={prevStep}
                        />
                      )}
                      {currentStep === 2 && (
                        <StepThree
                          nextStep={nextStep}
                          prevStep={prevStep}
                          profile={profile}
                        />
                      )}
                      {currentStep === 3 && (
                        <StepFour nextStep={nextStep} prevStep={prevStep} />
                      )}
                      {currentStep === 4 && (
                        <StepFive nextStep={prevStep} profile={profile} />
                      )}
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              {userProfileChatwoot ? (
                <div className="flex justify-center">
                  {userProfileChatwoot && (
                    <ProfileChatwoot profile={userProfileChatwoot} />
                  )}
                </div>
              ) : (
                <div className="py-5">
                  <div className="flex flex-col gap-2 rounded-lg bg-slate-900 p-5 text-center ">
                    <h2 className="text-sm font-bold">
                      No hay perfil disponible
                    </h2>
                    <p className="text-xs font-light">
                      Por favor, crea una cuenta para visualizar el perfil.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="tab3">
              {userProfileChatwoot ? (
                <div className="flex justify-center">
                  {userProfileChatwoot && (
                    <AccountProfile
                      profileSAgent={profile}
                      profile={userProfileChatwoot}
                    />
                  )}
                </div>
              ) : (
                <div className="py-5">
                  <div className="flex flex-col gap-2 rounded-lg bg-slate-900 p-5 text-center ">
                    <h2 className="text-sm font-bold">
                      No hay agentes disponibles
                    </h2>
                    <p className="text-xs font-light">
                      Por favor, crea una cuenta para visualizar los agentes.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
