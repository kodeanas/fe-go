import { AppTable } from "@/components/globals/app-table"
import { formatRibuan } from "@/lib/utils"
import { BastResponse } from "@/services/inbound/scanIn/bast/BastType"
import { Meta } from "@/services/Meta"
import { Edit, EyeIcon, Scan, ScanBarcode, Trash2 } from "lucide-react"
import Link from "next/link"

type Props = {
  bast: BastResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function BastTable({
  bast,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  // Data
  const columns = [
    {
      header: "Code",
      render: (item: BastResponse) => (
        <span className="font-bold">{item.code}</span>
      ),
    },
    {
      header: "Nama File",
      render: (item: BastResponse) => `${item.file_name}`,
    },
    {
      header: "Item & Harga",
      render: (item: BastResponse) => (
        <div className="flex flex-col gap-1 font-bold">
          {/* Baris Atas: Nama Item */}
          <span className="text-md text-gray-800">{item.file_item}</span>

          {/* Baris Bawah: Harga dengan format ribuan */}
          <span className="text-md text-blue-600">
            Rp {formatRibuan(item.file_price)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (item: BastResponse) => (
        <span className="text-md rounded-lg bg-blue-600 px-3 py-1 font-medium text-white uppercase">
          {item.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item: BastResponse) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/bast/${item.id}`}
            className="text-blue-500 hover:cursor-pointer hover:text-blue-800"
            onClick={() => {}}
          >
            <EyeIcon />
          </Link>
          {item.status === "progress" && (
            <Link
              href={`/bast/${item.id}/scanner`}
              onClick={() => {}}
              className="text-green-500 hover:cursor-pointer hover:text-green-800"
            >
              <ScanBarcode />
            </Link>
          )}
        </div>
      ),
    },
  ]
  return (
    <div>
      <AppTable
        columns={columns}
        data={bast}
        onSearch={onSearch}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        meta={meta}
      />
    </div>
  )
}
