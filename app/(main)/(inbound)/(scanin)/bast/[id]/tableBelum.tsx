import { AppTable } from "@/components/globals/app-table"
import { DiscrepancyItemResponse } from "@/services/inbound/scanIn/bast/BastType"
import { Meta } from "@/services/Meta"

type Props = {
  discrepancyItem: DiscrepancyItemResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function TableBelum({
  discrepancyItem,
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
      render: (item: DiscrepancyItemResponse) => item.barcode,
    },
    {
      header: "Nama",
      render: (item: DiscrepancyItemResponse) => item.name,
    },
    {
      header: "Jumlah",
      render: (item: DiscrepancyItemResponse) => item.item,
    },
    {
      header: "Harga",
      render: (item: DiscrepancyItemResponse) =>
        `Rp ${item.price.toLocaleString()}`,
    },
  ]
  return (
    <div className="w-full rounded-lg border-2 border-gray-300 p-4">
      <AppTable
        columns={columns}
        data={discrepancyItem}
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
