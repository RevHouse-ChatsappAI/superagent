// Componente StepOne.jsx
import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"
import { Spinner } from "@/components/ui/spinner"

interface StepOneProps {
  nextStep: () => void
}

const StepOne = ({ nextStep }: StepOneProps) => {
  //Context
  const { handleProfileChatwoot } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })

  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiChatwoot = new ApiChatwootPlatform()
      const mock = {
        name: user.name,
        email: user.email,
        password: user.password,
        type: "SuperAdmin",
        custom_attributes: {},
      }
      const response = await apiChatwoot.createUser(mock)

      if (response.confirmed) {
        handleProfileChatwoot(response)
        nextStep()
        return
      }

      throw new Error("No se ha podido crear el usuario.")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="mb-4 text-sm text-gray-700 dark:text-gray-500">
        Creación de Usuario en chatsappAI
      </h2>
      <form
        onSubmit={handleAddUserChatwoot}
        className="flex flex-1 flex-col justify-between gap-5"
      >
        <div className="flex flex-col gap-4">
          <label className="flex w-full flex-col">
            <p className="text-sm">Nombre de usuario</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Ej: Julian"
              required
            />
          </label>
          <label className="flex w-full flex-col gap-1">
            <p className="text-sm">Correo Electronico </p>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Ej: usuario@ejemplo.com"
              required
            />
          </label>

          <label className="flex w-full flex-col gap-1">
            <p className="text-sm">Password</p>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? <Spinner/> : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StepOne
