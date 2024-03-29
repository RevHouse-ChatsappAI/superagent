import React, { useState } from "react"
import { FaUser } from "react-icons/fa"
import { IoIosSettings } from "react-icons/io"
import { MdSwitchAccount } from "react-icons/md"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
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
import { SettingCRM } from "./SettingCRM"
import { useToast } from "@/components/ui/use-toast"
import CreateUser from "@/components/steps/CreateUser"
import CreateAccount from "@/components/steps/CreateAccount"
import CreateAgentBot from "@/components/steps/CreateAgentBot"

export const BtnConecctionChatsAppAIExtend = ({
  profile,
  isTokenActive,
  isAvailableExtendChatwoot,
  setIsAvailableKey,
}: {
  profile: Profile
  isTokenActive: boolean
  isAvailableExtendChatwoot?: boolean
  setIsAvailableKey?: (value: boolean) => void
}) => {
  const {toast} = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [key, setKey] = useState("")
  const [url, setUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const { userProfileChatwoot, platformKey } = useChatwoot()

  const handleAddPlatformKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const api = new Api(profile?.api_key)
      const platformKeyData = await api.postPlatformKey({ key: key, url: url })

      if (setIsAvailableKey) {
        if(platformKeyData.success){
          toast({
            description: platformKeyData.message
          })
        }else{
          toast({
            description: platformKeyData.message
          })
        }
        setIsAvailableKey(platformKeyData.success)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
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
        {isAvailableExtendChatwoot ? (
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
                <TabTrigger value="tab4">
                  <IoIosSettings className="text-xl" />
                </TabTrigger>
              </TabList>
              <TabContent value="tab1">
                <div className="flex h-full flex-col gap-3">
                  {isTokenActive ? (
                    <div className="flex flex-1 flex-col pt-3">
                      <div className="flex flex-1 flex-col gap-5">
                        {currentStep === 1 && (
                          <CreateAccount
                            profile={profile}
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
                          <CreateAgentBot nextStep={nextStep} prevStep={prevStep} />
                        )}
                        {currentStep === 4 && (
                          <StepFive nextStep={prevStep} profile={profile} />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col pt-8">
                      <div className="flex flex-1 flex-col gap-5">
                        {currentStep === 1 && <CreateUser profile={profile} nextStep={nextStep} />}
                        {currentStep === 2 && (
                          <CreateAccount profile={profile} nextStep={nextStep} prevStep={prevStep} />
                        )}
                        {currentStep === 3 && (
                          <StepThree
                            nextStep={nextStep}
                            prevStep={prevStep}
                            profile={profile}
                          />
                        )}
                        {currentStep === 4 && (
                          <CreateAgentBot nextStep={nextStep} prevStep={prevStep} />
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
              <TabContent value="tab4">
                {userProfileChatwoot && (
                  <div className="flex justify-center">
                    {userProfileChatwoot && (
                      <SettingCRM
                        platformKey={platformKey!}
                        profileSAgent={profile}
                        profile={userProfileChatwoot}
                      />
                    )}
                  </div>
                )}
              </TabContent>
            </Tabs>
          </DialogHeader>
        ) : (
          <form onSubmit={handleAddPlatformKey} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Label className="mb-2">Ingresa tu URL API de Chatwoot</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="mb-2">Ingresa tu Plaform Key de Chatwoot</Label>
              <Input value={key} onChange={(e) => setKey(e.target.value)} />
            </div>

            <div className="mt-2 flex justify-end">
              <Button>{loading ? <Spinner /> : "Guardar Cambio"}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
