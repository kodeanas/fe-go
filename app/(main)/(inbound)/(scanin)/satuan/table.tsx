import { AppModal } from "@/components/globals/app-modal"
import { AppTable } from "@/components/globals/app-table"
import { formatRibuan } from "@/lib/utils"
import { ClassResponse } from "@/services/class/ClassType"
import { SatuanResponse } from "@/services/inbound/scanIn/satuan/SatuanType"
import { Meta } from "@/services/Meta"
import { Edit, Eye, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  satuan: SatuanResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function SatuanTable({
  satuan,
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
      header: "Barcode",
      render: (item: SatuanResponse) => (
        <span className="font-bold">{item.barcode}</span>
      ),
    },
    {
      header: "Nama",
      render: (item: SatuanResponse) => `${item.name}`,
    },
    {
      header: "Item",
      render: (item: SatuanResponse) => `${formatRibuan(item.item)}`,
    },
    {
      header: "Harga Asal",
      render: (item: SatuanResponse) => `Rp ${formatRibuan(item.price)}`,
    },
    {
      header: "Harga Gudang",
      render: (item: SatuanResponse) =>
        `Rp ${formatRibuan(item.price_warehouse)}`,
    },
    {
      header: "Status",
      render: (item: SatuanResponse) => `${item.status}`,
    },
    {
      header: "Kategori",
      render: (item: SatuanResponse) => `${item.category_name || "-"}`,
    },
    {
      header: "Sticker",
      render: (item: SatuanResponse) => `${item.sticker_name || "-"}`,
    },
    {
      header: "Action",
      render: (item: SatuanResponse) => (
        <div className="flex items-center gap-2">
          <button
            className="text-blue-400 hover:cursor-pointer hover:text-blue-800"
            onClick={() => handleOpenDetail(item)}
          >
            <Eye />
          </button>
          <button
            onClick={() => {}}
            className="text-red-500 hover:cursor-pointer hover:text-red-800"
          >
            <Trash2 />
          </button>
        </div>
      ),
    },
  ]

  // ModalDetail
  const [modalDetail, setModalDetail] = React.useState(false)
  const [barcode, setBarcode] = React.useState("")
  const [name, setName] = React.useState("")
  const [item, setItem] = React.useState(0)
  const [price, setPrice] = React.useState(0)
  const [priceWarehouse, setPriceWarehouse] = React.useState(0)
  const [status, setStatus] = React.useState<
    "good" | "damaged" | "abnormal" | "non"
  >("good")
  const [note, setNote] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [sticker, setSticker] = React.useState("")
  const handleOpenDetail = (item: SatuanResponse) => {
    setBarcode(item.barcode)
    setName(item.name)
    setItem(item.item)
    setPrice(item.price)
    setPriceWarehouse(item.price_warehouse)
    setStatus(item.status)
    setNote(item.note || "")
    setCategory(item.category_name || "")
    setSticker(item.sticker_name || "")
    setModalDetail(true)
  }
  const handleCloseDetail = () => {
    setBarcode("")
    setName("")
    setItem(0)
    setPrice(0)
    setPriceWarehouse(0)
    setStatus("good")
    setNote("")
    setCategory("")
    setSticker("")
    setModalDetail(false)
  }

  return (
    <div className="space-y-5">
      <AppTable
        columns={columns}
        data={satuan}
        onSearch={onSearch}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        meta={meta}
      />
      {modalDetail && (
        <AppModal title="Detail Input Satuan" onClose={handleCloseDetail}>
          <div className="space-y-5 py-2">
            {/* Header Info */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Barcode
                </p>
                <p className="font-mono text-lg font-semibold text-gray-800">
                  {barcode || "-"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Status
                </p>
                {/* Badge 1 Warna (Biru) */}
                <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase">
                  {status || "NON"}
                </span>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Nama Satuan
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {name || "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Item
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {item || "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Kategori
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {category || "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Stiker
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {sticker || "-"}
                </p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Harga Jual
                </p>
                <p className="text-md font-bold tracking-tight text-gray-800">
                  Rp {formatRibuan(price)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Harga Gudang
                </p>
                <p className="text-md font-bold tracking-tight text-gray-800">
                  Rp {formatRibuan(priceWarehouse)}
                </p>
              </div>
            </div>

            {/* Note Section */}
            <div className="pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Catatan
              </p>
              <p className="mt-1 text-sm text-gray-600 italic">
                {note || "Tidak ada catatan."}
              </p>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  )
}
