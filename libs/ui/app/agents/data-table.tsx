"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { DataTablePagination } from "@/components/data-table-pagination"

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
  const router = useRouter()
  const { toast } = useToast()
  const api = new Api(profile.api_key)
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
      <div className="mb-10 flex gap-5 rounded-md">
        {data.map((agent: any) => (
          <div
            onClick={() => router.push(`/agents/${agent.id}`)}
            className="relative h-[200px] w-[320px] cursor-pointer rounded-lg border bg-slate-200 p-3 hover:border-black dark:bg-slate-900 dark:text-white dark:hover:border-white"
          >
            <h2 className="text-xl font-bold">{agent.name}</h2>
            <p className="text-sm font-light">{agent.description}</p>
            <div className="absolute bottom-1 end-2 flex items-center gap-2">
              <p className=" rounded-lg bg-slate-200 px-4 py-1 text-xs font-bold text-black">
                {agent.llmModel.slice(0, 5)}
              </p>
              <p>
                {agent.isActive ? (
                  <div className="rounded-lg bg-green-600 px-3 py-1 text-xs">
                    Activo
                  </div>
                ) : (
                  <div className="rounded-lg bg-red-600 px-3 py-1 text-xs">
                    Inactivo
                  </div>
                )}
              </p>
            </div>
          </div>
        ))}
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
