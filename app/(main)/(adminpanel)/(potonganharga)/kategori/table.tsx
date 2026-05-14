"use client"

import { AppModal } from "@/components/globals/app-modal"
import { formatRibuan } from "@/lib/utils"
import {
  deleteCategory,
  editCategory,
} from "@/services/category/CategoryService"
import { CategoryResponse } from "@/services/category/CategoryType"
import { Meta } from "@/services/Meta"
import { Edit, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  categories: CategoryResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void // Prop baru
}

export default function TableKategori({
  categories,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  // Edit
  const [editModal, setEditModal] = React.useState(false)
  const [name, setName] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")
  const [maxPrice, setMaxPrice] = React.useState(0)
  const [id, setId] = React.useState("")

  const handleOpenEdit = (category: CategoryResponse) => {
    setId(category.id)
    setName(category.name)
    setDiscount(category.discount)
    setStatus(category.status)
    setMaxPrice(category.max_price)
    setEditModal(true)
  }

  const handleCloseEdit = () => {
    setEditModal(false)
    setId("")
    setName("")
    setDiscount(0)
    setStatus("active")
    setMaxPrice(0)
  }

  // Edit
  const handleEdit = async (e: any) => {
    // e.preventDefault()
    try {
      const data = await editCategory(id, {
        name,
        discount,
        status,
        max_price: maxPrice,
      })
      handleCloseEdit()
      alert("Berhasil mengubah kategori")
      refreshData() // Panggil refreshData setelah berhasil edit
    } catch (error) {
      alert("Gagal mengubah kategori")
    }
  }

  // Delete Modal
  const [deleteModal, setDeleteModal] = React.useState(false)
  const handleOpenDelete = (category: CategoryResponse) => {
    setId(category.id)
    setName(category.name)
    setDeleteModal(true)
  }

  const handleCloseDelete = () => {
    setDeleteModal(false)
    setId("")
    setName("")
  }

  const handleDelete = async (e: any) => {
    try {
      const data = await deleteCategory(id)
      handleCloseDelete()
      alert("Berhasil menghapus kategori")
      refreshData() // Panggil refreshData setelah berhasil delete
    } catch (error) {
      alert("Gagal menghapus kategori")
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
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Kategori</th>
              <th className="px-4 py-3 text-left font-semibold">Diskon</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {category.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {category.discount}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {category.status ? (
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
                      onClick={() => handleOpenEdit(category)}
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(category)}
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
        <AppModal title="Edit Kategori" onClose={() => handleCloseEdit()}>
          <form
            action=""
            className="grid grid-cols-2 gap-3"
            onSubmit={handleEdit}
            method="POST"
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
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "inactive")
                }
                value={status}
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
                type="number"
                value={maxPrice}
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
              <span className="font-semibold">Discount</span>
              <input
                name="discount"
                type="number"
                value={discount}
                onChange={(e) => {
                  let value = Number(e.target.value)

                  if (value > 100) value = 100 // Maksimal 100
                  if (value < 0) value = 0 // Minimal 0 (mencegah angka minus)

                  setDiscount(value)
                }}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Discount ..."
              />
              <span className="text-[10px] text-gray-500 italic">
                Format: {discount}%
              </span>
            </div>

            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCloseEdit()}
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
      {/* Modal Delete user */}
      {deleteModal && (
        <AppModal onClose={handleCloseDelete} title="Hapus User">
          <form method="delete" onSubmit={handleDelete}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus kategori ini?</p>
                  <h3 className="text-xl font-bold">{name ?? "Kategori"}</h3>
                </div>
              </div>
              <div className="w-full space-y-2">
                <button className="w-full rounded-lg border-2 border-gray-400 bg-gray-300 text-gray-600 hover:cursor-pointer hover:bg-gray-700 hover:text-gray-200 dark:bg-transparent">
                  Hapus
                </button>
                <button className="w-full rounded-lg border-2 border-red-400 bg-red-600 text-white hover:cursor-pointer hover:bg-transparent hover:text-red-600">
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
