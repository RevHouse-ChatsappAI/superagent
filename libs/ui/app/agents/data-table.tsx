"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Profile } from "@/types/profile"
import { Toaster } from "@/components/ui/toaster"
import { DataTablePagination } from "@/components/data-table-pagination"

import { CardAgent } from "./components/CardAgent"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  profile: Profile
  pagination: {
    take: number
    currentPageNumber: number
    totalPages: number
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  profile,
  pagination: { currentPageNumber, take, totalPages },
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: {
        pageIndex: 0, // we are setting pageIndex to 0 because we have only the current page's data
        pageSize: take,
      },
    },
  })

  return (
    <div className="px-6">
      <div className="mb-10 grid grid-cols-1 gap-5 rounded-md md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {data.length === 0 ? (
          <div className="col-span-full mx-auto w-[500px] rounded-md border p-5 shadow-md">
            <span className="text-3xl">🤖</span>
            <p className="my-2 text-sm font-bold">
              Aún no se han creado agentes.
            </p>
            <p className="text-md mt-1 text-gray-600 dark:text-gray-500">
              ¡Comienza creando tu primer agente ahora!
            </p>
          </div>
        ) : (
          data.map((agent: any) => (
            <CardAgent key={agent.id} agent={agent} profile={profile} />
          ))
        )}
      </div>

      <DataTablePagination
        className="py-4"
        table={table}
        currentPageNumber={currentPageNumber}
      />
      <Toaster />
    </div>
  )
}
