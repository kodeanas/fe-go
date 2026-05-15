import { InputText } from "@/components/globals/app-input"
import { AppModal } from "@/components/globals/app-modal"
import { AppTable } from "@/components/globals/app-table"
import {
  deleteBuyer,
  updateBuyer,
} from "@/services/masterData/buyer/BuyerService"
import { BuyerResponse } from "@/services/masterData/buyer/BuyerType"
import { Meta } from "@/services/Meta"
import { Edit, Eye, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  buyers: BuyerResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function BuyerTable({
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
  buyers,
}: Props) {
  // Table
  const columns = [
    {
      header: "Name",
      render: (item: BuyerResponse) => (
        <span className="font-bold">{item.name}</span>
      ),
    },
    {
      header: "Phone",
      render: (item: BuyerResponse) => item.phone,
    },
    {
      header: "Email",
      render: (item: BuyerResponse) => item.email,
    },
    {
      header: "Address",
      render: (item: BuyerResponse) => item.address,
    },
    {
      header: "Action",
      render: (item: BuyerResponse) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDetail(item.id)}
            className="text-blue-400 hover:cursor-pointer hover:text-blue-700"
          >
            <Eye />
          </button>
          <button
            className="text-yellow-300 hover:cursor-pointer hover:text-yellow-500"
            onClick={() => handleEditModal(item)}
          >
            <Edit />
          </button>
          <button
            onClick={() => handleDeleteModal(item.id, item.name)}
            className="text-red-500 hover:cursor-pointer hover:text-red-800"
          >
            <Trash2 />
          </button>
        </div>
      ),
    },
  ]
  //   Detail
  const router = useRouter()

  const handleDetail = (id: string) => {
    router.push(`/buyer/${id}`)
  }

  //   Edit
  const [editModal, setEditModal] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [idEdit, setIdEdit] = useState("")
  const handleEditModal = (item: BuyerResponse) => {
    setName(item.name)
    setPhone(item.phone)
    setEmail(item.email)
    setAddress(item.address)
    setIdEdit(item.id)
    setEditModal(true)
  }
  const handleCloseEditModal = () => {
    setEditModal(false)
    setName("")
    setPhone("")
    setEmail("")
    setAddress("")
    setIdEdit("")
  }
  const handleEditSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const data = await updateBuyer(idEdit, {
        name,
        phone,
        email,
        address,
      })
      alert("Buyer berhasil diedit")
      handleCloseEditModal()
      refreshData()
    } catch (error) {
      console.error(error)
      alert("Gagal mengedit buyer")
    }
  }

  //   Delete
  const [modalDelete, setModalDelete] = useState(false)
  const [idDelete, setIdDelete] = useState("")
  const [nameDelete, setNameDelete] = useState("")

  const handleDeleteModal = (id: string, name: string) => {
    setIdDelete(id)
    setNameDelete(name)
    setModalDelete(true)
  }
  const handleCloseDeleteModal = () => {
    setModalDelete(false)
    setIdDelete("")
    setNameDelete("")
  }
  const handleDeleteSubmit = async () => {
    try {
      const res = await deleteBuyer(idDelete)
      alert("Buyer berhasil dihapus")
      refreshData()
      handleCloseDeleteModal()
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus buyer")
      handleCloseDeleteModal()
    }
  }

  return (
    <div className="">
      <AppTable
        columns={columns}
        data={buyers}
        onSearch={onSearch}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        meta={meta}
      />
      {/* Edit Modal */}
      {editModal && (
        <AppModal title="Edit Buyer" onClose={handleCloseEditModal}>
          <form
            action=""
            method="post"
            className="grid grid-cols-2 gap-3 space-y-3"
            onSubmit={handleEditSubmit}
          >
            <InputText label="Nama Buyer" value={name} onChange={setName} />
            <InputText label="Phone" value={phone} onChange={setPhone} />
            <InputText label="Email" value={email} onChange={setEmail} />
            <InputText label="Address" value={address} onChange={setAddress} />
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseEditModal}
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

      {/* Delete Modal */}
      {modalDelete && (
        <AppModal onClose={handleCloseDeleteModal} title="Hapus Buyer">
          <form method="delete" onSubmit={handleDeleteSubmit}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus Buyer ini?</p>
                  <h3 className="text-xl font-bold">{nameDelete ?? "Buyer"}</h3>
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
                  onClick={handleCloseDeleteModal}
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
