"use client"

import Link from "next/link"

import { Resolutions } from "./Resolutions"
import { Title } from "./Title"

interface DataTableProps<TData> {
  data: TData[]
}
export const Dashboard = <TData extends {}>({
  data,
}: DataTableProps<TData>) => {
  return (
    <div className="flex flex-col gap-9 p-5">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl">Panel de control</h2>
        <h2 className="text-3xl">Bienvenido a ChatsappAI</h2>
      </div>
      <div className="flex flex-wrap gap-9 rounded-lg border-2 p-5">
        <Title title="Mensajes Recibidos" value="1982" />
        <Title title="Mensajes Enviados" value="1982" />
        <Title title="Conversaciones" value="1982" />
        <Title title="Dinero Ahorrado" value="1982" />
        <Title title="Resoluciones" value="1982" />
        <Title title="Usuarios únicos" value="1982" />
        <Title title="Tiempo Ahorrado" value="1982" />
        <Title title="Derivaciones a humanos" value="1982" />
        <Title title="Miembros del Equipo" value="1982" />
        <Title title="Agentes de IA" value={data.length} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border-2 p-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Resoluciones</h2>
            <p className="text-gray-400">
              Entiende qué tan satisfechos están tus clientes con las
              respuestas.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <Resolutions
              title="Resoluciones Confirmadas"
              value={0}
              color="bg-green-500"
            />
            <Resolutions
              title="Resoluciones Supuestas"
              value={0}
              color="bg-yellow-500"
            />
            <Resolutions
              title="Sin Resoluciones"
              value={0}
              color="bg-red-500"
            />
            <Resolutions title="No Claro" value={0} color="bg-gray-500" />
          </div>
        </div>
        <div className="rounded-lg border-2 p-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Problemas más comunes</h2>
            <p className="text-gray-400">
              Aquí algunos de los problemas más comunes.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xs text-gray-400">Palabras Clave</h2>
            <h2 className="text-xs text-gray-400">Menciones</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
