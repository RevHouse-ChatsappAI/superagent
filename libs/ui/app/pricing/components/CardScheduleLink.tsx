"use client"

import React from "react"
import Link from "next/link"

// import { CalendarIcon } from "@/components/svg/CalendarIcon"

export const CardScheduleLink = () => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-between rounded-lg border border-gray-100 bg-white p-6 text-start text-gray-900 shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8">
      <div>
        <h3 className="mb-4 text-2xl font-semibold">Agendar una demo</h3>
        <p className="text-base font-light text-gray-500 dark:text-gray-400">
          Descubre las ventajas de nuestro producto programando una
          demostración.
        </p>
        <div className="my-8 flex items-baseline justify-center">
          <span className="text-gray-500 dark:text-gray-400">
            Agendar una demo te permite conocer en detalle las funcionalidades
            de nuestro producto y cómo puede ayudar a optimizar tus procesos.
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="grid w-full grid-cols-1 gap-4">
          <Link
            target="_black"
            href="https://cal.com/sebastianrinaldi/chatsappai-basico"
            className="flex w-full items-center justify-start gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            {/* <CalendarIcon /> */}
            <span>Demo Básico</span>
          </Link>
          <Link
            target="_black"
            href="https://cal.com/sebastianrinaldi/chatsappai-para-pymes"
            className="flex w-full items-center justify-start gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            {/* <CalendarIcon /> */}
            <span>Demo para PyMEs</span>
          </Link>
          <Link
            target="_black"
            href="https://cal.com/sebastianrinaldi/chatsappai-para-pymes-con-alto-volumen"
            className="flex w-full items-center justify-start gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            {/* <CalendarIcon /> */}
            <span>Demo para PyMEs con alto volumen</span>
          </Link>
          <Link
            target="_black"
            href="https://cal.com/sebastianrinaldi/chatsappai-personalizado"
            className="flex w-full items-center justify-start gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          >
            {/* <CalendarIcon /> */}
            <span>Demo Personalizado</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
