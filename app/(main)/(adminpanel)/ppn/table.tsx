import { AppModal } from "@/components/globals/app-modal"
import { Meta } from "@/services/Meta"
import { deletePpn, updatePpn } from "@/services/ppn/PpnService"
import { PpnResponse } from "@/services/ppn/PpnType"
import { Edit, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  taxes: PpnResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void // Prop baru
}

export default function TablePpn({
  taxes,
  refreshData,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
}: Props) {
  // Edit
  const [editModal, setEditModal] = React.useState(false)
  const [tax, setTax] = React.useState(0)
  const [isActive, setIsActive] = React.useState(false)
  const [editId, setEditId] = React.useState("")
  const handleOpenEdit = (tax: PpnResponse) => {
    setEditId(tax.id)
    setTax(tax.tax)
    setIsActive(tax.is_active)
    setEditModal(true)
  }

  const handleCloseEdit = () => {
    setEditId("")
    setTax(0)
    setIsActive(false)
    setEditModal(false)
  }

  const handleSubmitEdit = async () => {
    try {
      const data = await updatePpn(editId, {
        tax,
        is_active: isActive,
      })
      handleCloseEdit()
      refreshData()
    } catch (error) {
      console.error(error)
    }
  }

  //   Delete
  const [deleteModal, setDeleteModal] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState("")
  const [deleteTax, setDeleteTax] = React.useState(0)

  const handleOpenDelete = (tax: PpnResponse) => {
    setDeleteId(tax.id)
    setDeleteTax(tax.tax)
    setDeleteModal(true)
  }

  const handleCloseDelete = () => {
    setDeleteId("")
    setDeleteTax(0)
    setDeleteModal(false)
  }

  const handleDelete = async () => {
    try {
      const res = await deletePpn(deleteId)
      handleCloseDelete()
      console.log(res)
      //   refreshData()
      //   alert("Berhasil menghapus PPN")
    } catch (error) {
      console.error(error)
      //   alert("Gagal menghapus PPN. Silakan coba lagi.")
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
              <th className="px-4 py-3 text-left font-semibold">Ppn</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {taxes.map((tax) => (
              <tr
                key={tax.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {tax.tax}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {tax.is_active ? (
                    <span className="rounded-xl bg-green-700 px-3 py-1 text-[10px] text-white">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-xl bg-red-700 px-3 py-1 text-[10px] text-white">
                      Tdk Aktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-yellow-300 hover:cursor-pointer hover:text-yellow-500"
                      onClick={() => handleOpenEdit(tax)}
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(tax)}
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
      {/* Edit Modal */}
      {editModal && (
        <AppModal title="Edit PPN" onClose={handleCloseEdit}>
          <form
            action=""
            onSubmit={handleSubmitEdit}
            method="post"
            className="grid grid-cols-2 gap-3"
          >
            <div className="space-y-1">
              <span className="font-semibold">PPN</span>
              <input
                name="tax"
                type="number"
                onChange={(e) => {
                  let value = Number(e.target.value)

                  if (value > 100) value = 100 // Maksimal 100
                  if (value < 0) value = 0 // Minimal 0 (mencegah angka minus)

                  setTax(value)
                }}
                value={tax}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan PPN ..."
              />
              <span className="text-[10px] text-gray-500 italic">
                Format: {tax}%
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Status</span>
              <select
                name="status"
                onChange={(e) =>
                  setIsActive(e.target.value === "true" ? true : false)
                }
                value={isActive.toString()}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </select>
            </div>
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseEdit}
                  className="rounded-lg border-2 px-3 py-1 hover:cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </AppModal>
      )}

      {/* Delete */}
      {deleteModal && (
        <AppModal onClose={handleCloseDelete} title="Hapus PPN">
          <form method="delete" onSubmit={handleDelete}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus kategori ini?</p>
                  <h3 className="text-xl font-bold">{deleteTax ?? "PPN"}%</h3>
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
                  onClick={handleCloseDelete}
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
