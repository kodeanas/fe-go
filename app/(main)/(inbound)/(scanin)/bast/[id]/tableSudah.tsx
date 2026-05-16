import { AppTable } from "@/components/globals/app-table"
import { ScannedItemResponse } from "@/services/inbound/scanIn/bast/BastType"
import { Meta } from "@/services/Meta"

type Props = {
  scannedItem: ScannedItemResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function TableSudah({
  scannedItem,
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
      header: "Barcode",
      render: (item: ScannedItemResponse) => item.barcode,
    },
    {
      header: "Nama",
      render: (item: ScannedItemResponse) => item.name,
    },
    {
      header: "Jumlah",
      render: (item: ScannedItemResponse) => item.item,
    },
    {
      header: "Harga",
      render: (item: ScannedItemResponse) =>
        `Rp ${item.price.toLocaleString()}`,
    },
    {
      header: "Status",
      render: (item: ScannedItemResponse) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            item.status === "good"
              ? "bg-green-100 text-green-600"
              : item.status === "damaged"
                ? "bg-red-100 text-red-600"
                : item.status === "abnormal"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      ),
    },
  ]
  return (
    <div className="w-full rounded-lg border-2 border-gray-300 p-4">
      <AppTable
        columns={columns}
        data={scannedItem}
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
