import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { Spinner } from "@/components/ui/spinner"
import { MdNavigateNext } from "react-icons/md";
import { Api } from "@/lib/api";
import { Profile } from "@/types/profile";

interface StepOneProps {
  nextStep: () => void
  profile: Profile
}
interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: Profile
}

const CreateUser = ({ nextStep, profile }: StepOneProps) => {

  //State
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: "", email: "", password: "", confirmPassword: "" };
  });

  //Context
  const { handleProfileChatwoot } = useChatwoot()

  //Function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => {
      const newUserState = { ...prevState, [name]: value };
      localStorage.setItem('user', JSON.stringify(newUserState));
      return newUserState;
    });
  };

  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setPasswordError(null)

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(user.password)) {
      setPasswordError("La contraseña debe tener al menos una letra mayúscula, un número y un mínimo de 8 caracteres.")
      setLoading(false)
      return;
    }

    if (user.password !== user.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.")
      setLoading(false)
      return;
    }

    try {
      const api = new Api(profile.api_key)
      const mock = {
        name: user.name,
        email: user.email,
        password: user.password,
        custom_attributes: {},
      }
      const response = await api.postCreateUser(mock)

      if (response.confirmed) {
        handleProfileChatwoot(response)
        nextStep()
        return
      }

      throw new Error("No se ha podido crear el usuario.")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="mb-4 text-sm text-gray-700 dark:text-gray-500">
        Creación de Usuario en CRM CHATWOOT
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
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Ej: Julian"
              required
            />
          </label>
          <label className="flex w-full flex-col gap-1">
            <p className="text-sm">Correo Electrónico</p>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Ej: usuario@ejemplo.com"
              required
            />
          </label>
          <label className="flex w-full flex-col">
            <p className="text-sm">Contraseña</p>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Ej: Abc#123"
              required
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-500">{passwordError}</p>
            )}
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            La contraseña debe contener al menos una mayúscula, un símbolo (.
            o #) y un número.
          </p>
          <label className="flex w-full flex-col">
            <p className="text-sm">Confirmar Contraseña</p>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 placeholder:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="Reingrese su contraseña"
              required
            />
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Por favor, confirme su contraseña.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-all hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? <Spinner /> : <MdNavigateNext />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateUser
