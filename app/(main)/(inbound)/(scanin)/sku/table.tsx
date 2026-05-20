import { AppTable } from "@/components/globals/app-table"
import { formatRibuan } from "@/lib/utils"
import { SkuResponse } from "@/services/inbound/scanIn/sku/SkuType"
import { Meta } from "@/services/Meta"
import { Eye } from "lucide-react"
import Link from "next/link"

type Props = {
  sku: SkuResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}
export default function TableSku({
  sku,
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
    // {
    //   header: "Code",
    //   render: (item: SkuResponse) => (
    //     <span className="font-bold">{item.code}</span>
    //   ),
    // },
    {
      header: "Nama File",
      render: (item: SkuResponse) => item.file_name,
    },
    {
      header: "Item & Harga",
      render: (item: SkuResponse) => (
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
      header: "Status",
      render: (item: SkuResponse) => (
        <span className="rounded-xl bg-blue-500 px-3 py-2 font-bold text-white uppercase">
          {item.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item: SkuResponse) => (
        <div className="flex items-center gap-5">
          <Link href={`/sku/${item.id}`}>
            <Eye size={20} className="text-blue-500 hover:text-blue-700" />
          </Link>
        </div>
      ),
    },
  ]
  return (
    <div className="w-full">
      <AppTable
        columns={columns}
        data={sku}
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
