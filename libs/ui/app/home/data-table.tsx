"use client"

import * as React from "react"
import { MdPublishedWithChanges } from "react-icons/md"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

export function DataTable({ profile }: { profile: Profile }) {
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [loading, setLoading] = React.useState<boolean>(false)

  const { toast } = useToast()

  const handleFreeSubscriptionClose = async () => {
    try {
      setLoading(true)

      if (profile.stripe_customer_id) {
        const res = await fetch("/api/onboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        })

        const data = await res.json()

        if (!res.ok || !data) {
          return toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
          })
        }
      }

      const api = new Api(profile.api_key)
      const response = await api.createAccountFreeSubscription({
        user_customer_id: profile.stripe_customer_id,
        nickname: "FREE",
      })
      if (!response.success) {
        toast({
          description: response?.message,
        })
        return
      }

      if (response.success) {
        toast({
          description: response?.message,
        })
        return
      }
    } catch (error) {
      console.error("Error creating free subscription:", error)
    } finally {
      setLoading(() => false)
      localStorage.setItem("showModal", "false")
      setIsModalVisible(false)
    }
  }

  React.useEffect(() => {
    const showModal = localStorage.getItem("showModal") !== "false"
    setIsModalVisible(showModal)
  }, [])

  const handleCloseModal = () => {
    localStorage.setItem("showModal", "false")
    setIsModalVisible(false)
  }
  return (
    <div className="px-6">
      {isModalVisible && (
        <div className="animate__animated animate__fadeOut fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-40">
          <div className="max-w-md rounded-lg border-2 bg-white p-6 text-center dark:bg-black">
            <h3 className="text-lg font-semibold">
              Bienvenido a ChatsApp CLOUD
            </h3>
            <p className="mt-2 text-sm">
              Para mejorar tu experiencia, te animamos a actualizar tu cuenta y
              descubrir las nuevas funcionalidades.
            </p>
            <button
              disabled={loading}
              onClick={handleFreeSubscriptionClose}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-slate-900 px-5 py-2 text-white transition duration-300 ease-in-out hover:bg-gray-600 dark:bg-gray-500"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <MdPublishedWithChanges />
                  <span>Actualizar cuenta</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
