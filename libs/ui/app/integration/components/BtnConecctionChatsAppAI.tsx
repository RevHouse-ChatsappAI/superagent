import React, { useState } from "react"
import { FaUser } from "react-icons/fa"
import { MdSwitchAccount } from "react-icons/md"

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

import { TabContent, TabList, Tabs, TabTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "@/components/svg/PlusIcon"
import { useChatwoot } from "@/app/context/ChatwootContext"
import { ProfileChatwoot } from "@/app/dashboard/components/ProfileChatwoot"
import StepFive from "@/app/dashboard/components/step/StepFive"
import StepFour from "@/app/dashboard/components/step/StepFour"
import StepOne from "@/app/dashboard/components/step/StepOne"
import StepThree from "@/app/dashboard/components/step/StepThree"
import StepTwo from "@/app/dashboard/components/step/StepTwo"

import { AccountProfile } from "./AccountProfile"

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
          <Tabs>
            <TabList>
              <TabTrigger value="tab1">CRM</TabTrigger>
              <TabTrigger value="tab2">
                <FaUser className="text-lg" />
              </TabTrigger>
              <TabTrigger value="tab3">
                <MdSwitchAccount className="text-xl" />
              </TabTrigger>
            </TabList>
            <TabContent value="tab1">
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
            </TabContent>
            <TabContent value="tab2">
              {userProfileChatwoot && (
                <div className="flex justify-center">
                  {userProfileChatwoot && (
                    <ProfileChatwoot profile={userProfileChatwoot} />
                  )}
                </div>
              )}
            </TabContent>
            <TabContent value="tab3">
              {userProfileChatwoot && (
                <div className="flex justify-center">
                  {userProfileChatwoot && (
                    <AccountProfile
                      profileSAgent={profile}
                      profile={userProfileChatwoot}
                    />
                  )}
                </div>
              )}
            </TabContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
