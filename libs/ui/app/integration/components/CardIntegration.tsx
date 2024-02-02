import React from "react"
import { RxCursorArrow } from "react-icons/rx"

interface Props {
  children?: React.ReactNode
  title: string
  description: string
  eventClick: (id: string) => void
  id: string
  titleBtn?: string
  disabled?: boolean
}

export const CardIntegration = ({
  children,
  title,
  description,
  eventClick,
  id,
  titleBtn,
  disabled
}: Props) => {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white px-3 py-5 md:col-span-3 md:h-[212px] md:w-[272px] lg:col-span-3 xl:col-span-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {children}
          <h2 className="text-lg font-bold text-gray-600">{title}</h2>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex justify-center">
        <button
          disabled={disabled}
          onClick={() => eventClick(id)}
          className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 ${disabled ? 'cursor-not-allowed bg-gray-400' : 'bg-black'}`}
        >
          <RxCursorArrow />
          <span>{titleBtn ? titleBtn : 'Conectar'}</span>
        </button>
      </div>
    </div>
  )
}
