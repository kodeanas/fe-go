import { AppModal } from "@/components/globals/app-modal"
import { formatRibuan } from "@/lib/utils"
import { Meta } from "@/services/Meta"
import { deleteSticker, updateSticker } from "@/services/sticker/StickerService"
import { StickerResponse } from "@/services/sticker/StickerType"
import { Edit, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  stickers: StickerResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void // Prop baru
}

export default function TableSticker({
  stickers,
  refreshData,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
}: Props) {
  // Modal Edit
  const [editModal, setEditModal] = React.useState(false)
  const [codeHex, setCodeHex] = React.useState("")
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("")
  const [fixedPrice, setFixedPrice] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")
  const [minPrice, setMinPrice] = React.useState(0)
  const [maxPrice, setMaxPrice] = React.useState(0)
  const [id, setId] = React.useState("") // State untuk menyimpan ID sticker yang sedang diedit

  const handleEditOpen = (sticker: StickerResponse) => {
    setId(sticker.id)
    setCodeHex(sticker.code_hex)
    setName(sticker.name)
    setType(sticker.type)
    setFixedPrice(sticker.fixed_price)
    setStatus(sticker.status)
    setMinPrice(sticker.min_price)
    setMaxPrice(sticker.max_price)
    setEditModal(true)
  }

  const handleEditClose = () => {
    setName("")
    setType("small") // Langsung set ke small
    setFixedPrice(12000) // Langsung set harga small
    setStatus("active")
    setCodeHex("#000000") // Beri default warna agar tidak error/kosong
    setMinPrice(0)
    setMaxPrice(0)
    setEditModal(false)
  }

  //   Edit api
  const handleEdit = async () => {
    try {
      const data = await updateSticker(id, {
        code_hex: codeHex,
        name,
        type,
        fixed_price: fixedPrice,
        status,
        min_price: minPrice,
        max_price: maxPrice,
      })
      refreshData() // Memanggil fungsi refreshData setelah berhasil mengubah sticker
      handleEditClose() // Menutup modal setelah berhasil mengubah sticker
      alert("Berhasil mengubah sticker")
    } catch (error) {
      console.error("Error updating sticker:", error)
      alert("Gagal mengubah sticker")
    }
  }

  //   Delete Modal
  const [deleteModal, setDeleteModal] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState("")
  const [deleteName, setDeleteName] = React.useState("")
  const [deleteCodeHex, setDeleteCodeHex] = React.useState("")

  const handleDeleteOpen = (sticker: StickerResponse) => {
    setDeleteId(sticker.id)
    setDeleteName(sticker.name)
    setDeleteCodeHex(sticker.code_hex)
    setDeleteModal(true)
  }
  const handleDeleteClose = () => {
    setDeleteModal(false)
    setDeleteId("")
    setDeleteName("")
    setDeleteCodeHex("")
  }

  const handleDelete = async () => {
    try {
      const data = await deleteSticker(deleteId)
      refreshData() // Memanggil fungsi refreshData setelah berhasil menghapus sticker
      handleDeleteClose() // Menutup modal setelah berhasil menghapus sticker
      alert("Berhasil menghapus sticker")
    } catch (error) {
      console.error("Error deleting sticker:", error)
      alert("Gagal menghapus sticker")
    }
  }

  return (
    <div className="space-y-5">
      <div className="w-full items-center justify-between space-y-5">
        <input
          type="text"
          name="name"
          className="border-2 border-gray-200 px-3 py-1"
          placeholder="Cari nama . . ."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Hex Sticker</th>
              <th className="px-4 py-3 text-left font-semibold">Nama</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Fixed</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {stickers.map((sticker) => (
              <tr
                key={sticker.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: `${sticker.code_hex}` }}
                  ></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{sticker.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{sticker.type}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  Rp {formatRibuan(sticker.fixed_price)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {sticker.status === "active" ? (
                    <span className="rounded-xl bg-green-700 px-3 py-1 text-[10px] text-white">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-xl bg-red-700 px-3 py-1 text-[10px] text-white">
                      Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-yellow-300 hover:cursor-pointer hover:text-yellow-500"
                      onClick={() => handleEditOpen(sticker)}
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDeleteOpen(sticker)}
                      className="text-red-500 hover:cursor-pointer hover:text-red-800"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination UI */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (meta && page < meta.pagination.total_pages) {
              setPage(page + 1)
            }
          }}
          disabled={!meta || page >= meta.pagination.total_pages}
        >
          Next
        </button>
        <select
          className="ml-4 rounded border px-2 py-1"
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
      {editModal && (
        <AppModal title="Tambah Sticker" onClose={handleEditClose}>
          <form
            action=""
            className="grid grid-cols-2 gap-3"
            onSubmit={handleEdit}
          >
            <div className="space-y-1">
              <span className="font-semibold">Nama</span>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Nama ..."
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Status</span>
              <select
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "inactive")
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Max Price</span>
              <input
                name="maxPrice"
                value={maxPrice}
                type="number"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Max Price ..."
              />
              {/* Helper */}
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(maxPrice)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Min Price</span>
              <input
                name="minPrice"
                value={minPrice}
                type="number"
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Min Price ..."
              />
              {/* Helper */}
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(minPrice)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Tipe</span>
              <select
                name="type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "small" | "big" | "tiny")
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="small">Small</option>
                <option value="big">Big</option>
                <option value="tiny">Tiny</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Fixed Price</span>
              <input
                name="fixedPrice"
                type="number"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Fixed Price ..."
              />
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(fixedPrice)}
              </span>
            </div>
            {/* Input Hex Color */}
            <div className="col-span-2 space-y-1">
              <span className="font-semibold">Warna Sticker (Hex)</span>
              <div className="flex items-center gap-3">
                {/* Preview & Color Picker */}
                <input
                  type="color"
                  value={codeHex || "#000000"}
                  onChange={(e) => setCodeHex(e.target.value)}
                  className="w-10 border-2 border-gray-300 p-0 hover:cursor-pointer"
                />

                {/* Text Input */}
                <input
                  name="code_hex"
                  type="text"
                  value={codeHex}
                  onChange={(e) => setCodeHex(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-3 uppercase"
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEditClose}
                  className="rounded-lg border-2 px-3 py-1 hover:cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  Tambah
                </button>
              </div>
            </div>
          </form>
        </AppModal>
      )}

      {/* Delete */}
      {deleteModal && (
        <AppModal onClose={handleDeleteClose} title="Hapus Sticker">
          <form method="delete" onSubmit={handleDelete}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus kategori ini?</p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: `${deleteCodeHex}` }}
                      ></div>
                      <h3 className="text-xl font-bold">
                        {deleteName ?? "Kategori"}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <button
                  type="submit"
                  className="w-full rounded-lg border-2 border-gray-400 bg-gray-300 text-gray-600 hover:cursor-pointer hover:bg-gray-700 hover:text-gray-200 dark:bg-transparent"
                >
                  Hapus
                </button>
                <button
                  onClick={handleDeleteClose}
                  className="w-full rounded-lg border-2 border-red-400 bg-red-600 text-white hover:cursor-pointer hover:bg-transparent hover:text-red-600"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </AppModal>
      )}
    </div>
  )
}
