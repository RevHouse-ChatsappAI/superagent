import React from "react"

interface Props {
  title: string
  prevStep: () => void
}

export const ButtonPrev: React.FC<Props> = ({ title, prevStep }) => {
  return (
    <button
      onClick={prevStep}
      className="rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
    >
      {title}
    </button>
  )
}
