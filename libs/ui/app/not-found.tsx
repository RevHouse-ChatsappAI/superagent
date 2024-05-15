import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-96 flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-6xl font-bold text-transparent dark:from-gray-600 dark:to-gray-200">
          404 - Página no encontrada
        </h1>
        <p className="text-lg text-gray-300 dark:text-gray-500">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-black shadow-lg hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          href="/home"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  )
}
