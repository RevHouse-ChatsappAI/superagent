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
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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

import Avatar from "./[agentId]/avatar"

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
      <div className="mb-10 grid grid-cols-1 gap-5 rounded-md md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <Card className="w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
          <div className="relative">
            <div className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
              h2
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              CEO of Nexus
            </h3>
            <p className="text-gray-600">Assem Chammah</p>
            <hr className="my-3" />
            <div className="grid grid-cols-2 gap-2">
              <Badge className="text-xs" variant="secondary">
                Customer support
              </Badge>
              <Badge className="text-xs" variant="secondary">
                NexusGPT
              </Badge>
              <Badge className="text-xs" variant="secondary">
                AI
              </Badge>
              <Badge className="text-xs" variant="secondary">
                Problem solving
              </Badge>
            </div>
          </div>
        </Card>

        {data.map((agent: any) => (
          <div
            onClick={() => router.push(`/agents/${agent.id}`)}
            className="relative h-[200px] cursor-pointer rounded-lg border bg-slate-200 p-3 hover:border-black dark:bg-slate-900 dark:text-white dark:hover:border-white"
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
