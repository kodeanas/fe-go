import React from "react"
import { Meta } from "@/services/Meta"

type Column<T> = {
  header: string
  render: (item: T) => React.ReactNode
}

type AppTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  meta?: Meta | null
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  onSearch?: (value: string) => void
  searchPlaceholder?: string
}

export function AppTable<T>({
  data,
  columns,
  meta,
  page,
  setPage,
  limit,
  setLimit,
  onSearch,
  searchPlaceholder = "Cari...",
}: AppTableProps<T>) {
  return (
    <div className="space-y-5">
      {onSearch && (
        <div className="w-full">
          <input
            type="text"
            className="rounded-md border-2 border-gray-200 px-3 py-1"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)} // Tambahkan tanda tanya (?)
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-gray-50"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-gray-500"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-sm font-medium">Halaman {page}</span>
        <button
          className="rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={!meta || page >= (meta.pagination?.total_pages || 0)}
        >
          Next
        </button>
        <select
          className="ml-4 rounded border px-2 py-1 text-sm"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[1, 5, 10, 20, 50].map((l) => (
            <option key={l} value={l}>
              {l} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
