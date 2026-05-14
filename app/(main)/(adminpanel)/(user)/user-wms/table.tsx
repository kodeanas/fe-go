import { UserResponse } from "@/services/user/UserType"

import { Meta } from "@/services/Meta"
import { Delete, DeleteIcon, Edit, Trash2 } from "lucide-react"
import React from "react"
import { AppModal } from "@/components/globals/app-modal"
import { deleteUser, editUser } from "@/services/user/UserService"

type Props = {
  users: UserResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export function TableUser({
  users,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  const [modalEdit, setModalEdit] = React.useState(false)
  const [editData, setEditData] = React.useState<UserResponse | null>(null)
  const [editName, setEditName] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")
  const [editPhone, setEditPhone] = React.useState("")
  const [editRole, setEditRole] = React.useState("")

  const openEditModal = (user: UserResponse) => {
    setEditData(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditPhone(user.phone)
    setEditRole(user.role)
    setModalEdit(true)
  }

  const closeEditModal = () => {
    setModalEdit(false)
    setEditData(null)
    setEditName("")
    setEditEmail("")
    setEditPhone("")
    setEditRole("")
  }

  const handleEdit = async (e: React.FormEvent) => {
    // e.preventDefault()
    if (!editData) return
    try {
      await editUser(editData.id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole as any,
        status: editData.status,
      })
      alert("Berhasil mengubah user")
      closeEditModal()
      refreshData()
      // TODO: refresh data, bisa lewat props callback atau window.location.reload()
      window.location.reload()
    } catch (err) {
      alert("Gagal mengubah user")
    }
  }

  // Delete
  const [modalDelete, setModalDelete] = React.useState(false)
  const [id, setId] = React.useState("")
  const [nameDelete, setNameDelete] = React.useState("")
  const openDeleteModal = (user: UserResponse) => {
    setModalDelete(true)
    setId(user.id)
    setNameDelete(user.name)
  }

  const closeDeleteModal = () => {
    setModalDelete(false)
    setId("")
    setNameDelete("")
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await deleteUser(id)
      alert("Berhasil menghapus user")
      closeDeleteModal()
      refreshData()
    } catch (err) {
      alert("Gagal Hapus data")
    }
  }
  return (
    <div className="">
      <div className="w-full items-center justify-between space-y-5">
        <input
          type="text"
          name="name"
          className="border-2 border-gray-200 px-3 py-1"
          placeholder="Cari nama . . ."
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {user.status ? (
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
                        onClick={() => openEditModal(user)}
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
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
      </div>
      {/* Modal Edit User */}
      {modalEdit && (
        <AppModal title="Edit User WMS" onClose={closeEditModal}>
          <form
            onSubmit={handleEdit}
            className="grid grid-cols-2 gap-3 space-y-3"
          >
            <div className="space-y-1">
              <span className="font-semibold">Nama</span>
              <input
                name="name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Nama ..."
                required
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Email</span>
              <input
                name="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Email ..."
                required
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Phone</span>
              <input
                name="phone"
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Phone ..."
                required
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Role</span>
              <select
                name="role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3 dark:bg-gray-500"
                required
              >
                <option value="users">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="font-semibold">Status</span>
              <select
                name="status"
                value={editData?.status ? "true" : "false"}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev!,
                    status: e.target.value === "true" ? true : false,
                  }))
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3 dark:bg-gray-500"
                required
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </select>
            </div>
            <div className="col-span-2 flex w-full justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border-2 px-3 py-1 hover:cursor-pointer"
                onClick={closeEditModal}
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
              >
                Ubah
              </button>
            </div>
          </form>
        </AppModal>
      )}

      {/* Modal Delete user */}
      {modalDelete && (
        <AppModal onClose={closeDeleteModal} title="Hapus User">
          <form method="delete" onSubmit={handleDelete}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus user ini?</p>
                  <h3 className="text-xl font-bold">{nameDelete ?? "User"}</h3>
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
