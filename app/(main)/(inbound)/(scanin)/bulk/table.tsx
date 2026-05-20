import { AppTable } from "@/components/globals/app-table"
import { formatRibuan } from "@/lib/utils"
import { BulkResponse } from "@/services/inbound/scanIn/bulk/BulkType"
import { Meta } from "@/services/Meta"
import { Eye } from "lucide-react"
import Link from "next/link"

type Props = {
  bulk: BulkResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function BulkTable({
  bulk,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  const columns = [
    {
      header: "Code",
      render: (item: BulkResponse) => (
        <span className="font-bold">{item.code}</span>
      ),
    },
    {
      header: "Nama File",
      render: (item: BulkResponse) => item.file_name,
    },
    {
      header: "Item & Harga",
      render: (item: BulkResponse) => (
        <div className="flex flex-col gap-1 font-bold">
          {/* Baris Atas: Nama Item */}
          <span className="text-md text-gray-800">{item.file_item}</span>

          {/* Baris Bawah: Harga dengan format ribuan */}
          <span className="text-md text-gray-800">
            Rp {formatRibuan(item.file_price)}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (item: BulkResponse) => (
        <div className="flex items-center gap-4 text-blue-500 hover:cursor-pointer hover:text-blue-800">
          <Link href={`/bulk/${item.id}`} className="flex items-center gap-2">
            <Eye />
          </Link>
        </div>
      ),
    },
  ]
  return (
    <div className="">
      <AppTable
        columns={columns}
        data={bulk}
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
