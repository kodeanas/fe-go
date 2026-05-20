import {
  InputCurrency,
  InputNumber,
  InputPercent,
  InputSelect,
  InputText,
} from "@/components/globals/app-input"
import { AppModal } from "@/components/globals/app-modal"
import { AppTable } from "@/components/globals/app-table"
import { formatRibuan } from "@/lib/utils"
import {
  deleteClass,
  downClass,
  upClass,
  updateClass,
} from "@/services/class/ClassService"
import { ClassResponse } from "@/services/class/ClassType"
import { Meta } from "@/services/Meta"
import { ArrowDown, ArrowUp, Edit, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  classes: ClassResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function TableKelasBuyer({
  classes,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  // Updown class
  const [idUp, setIdUp] = React.useState("")
  const handleUp = async (id: string) => {
    try {
      const data = await upClass(id)
      refreshData()
      alert("Kelas buyer berhasil diup")
    } catch (error) {
      console.error(error)
      // alert("Gagal up kelas buyer")
    }
  }

  const handleDown = async (id: string) => {
    try {
      const data = await downClass(id)
      alert("Kelas buyer berhasil di down")
      refreshData()
    } catch (error) {
      console.error(error)
      alert("Gagal down kelas buyer")
    }
  }

  // Table
  const columns = [
    {
      header: "Name",
      render: (item: ClassResponse) => (
        <span className="font-bold">{item.name}</span>
      ),
    },
    {
      header: "Disc (%)",
      render: (item: ClassResponse) => `${item.disc}%`,
    },
    {
      header: "Min Order",
      render: (item: ClassResponse) => formatRibuan(item.min_order),
    },
    {
      header: "Min Transaksi",
      render: (item: ClassResponse) =>
        `Rp ${formatRibuan(item.min_transaction_value)}`,
    },
    {
      header: "Week",
      render: (item: ClassResponse) => `Minggu ke-${item.week}`,
    },
    {
      header: "Urutan",
      render: (item: ClassResponse) => `ke-${item.iteration}`,
    },
    {
      header: "Status",
      render: (item: ClassResponse) => (
        <span
          className={`rounded-xl px-3 py-1 text-[10px] text-white ${item.status === "active" ? "bg-green-700" : "bg-red-700"}`}
        >
          {item.status === "active" ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item: ClassResponse) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUp(item.id)}
            className="text-green-300 hover:cursor-pointer hover:text-green-700"
          >
            <ArrowUp />
          </button>
          <button
            className="text-blue-500 hover:cursor-pointer hover:text-blue-800"
            onClick={() => handleDown(item.id)}
          >
            <ArrowDown />
          </button>
          <button
            className="text-yellow-300 hover:cursor-pointer hover:text-yellow-500"
            onClick={() => handleOpenEdit(item)}
          >
            <Edit />
          </button>
          <button
            onClick={() => handleOpenDelete(item.id, item.name)}
            className="text-red-500 hover:cursor-pointer hover:text-red-800"
          >
            <Trash2 />
          </button>
        </div>
      ),
    },
  ]

  const [modalEdit, setModalEdit] = React.useState(false)
  const [name, setName] = React.useState("")
  const [disc, setDisc] = React.useState(0)
  const [minOrder, setMinOrder] = React.useState(0)
  const [minTransactionValue, setMinTransactionValue] = React.useState(0)
  const [week, setWeek] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")
  const [idEdit, setIdEdit] = React.useState("")
  const handleOpenEdit = (item: ClassResponse) => {
    setName(item.name)
    setDisc(item.disc)
    setMinOrder(item.min_order)
    setMinTransactionValue(Number(item.min_transaction_value))
    setWeek(item.week)
    setIdEdit(item.id)
    setStatus(item.status)
    setModalEdit(true)
  }
  const handleCloseEdit = () => {
    setName("")
    setDisc(0)
    setMinOrder(0)
    setMinTransactionValue(0)
    setWeek(0)
    setIdEdit("")
    setStatus("active")
    setModalEdit(false)
  }
  const handleEditSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const data = await updateClass(idEdit, {
        name,
        disc,
        min_order: minOrder,
        min_transaction_value: minTransactionValue,
        week,
        status,
      })
      alert("Kelas buyer berhasil di edit")
      refreshData()
      handleCloseEdit()
    } catch (error) {
      console.error(error)
      alert("Gagal mengedit kelas buyer")
      handleCloseEdit()
    }
  }

  // Delete
  const [idDelete, setIdDelete] = React.useState("")
  const [openDelete, setOpenDelete] = React.useState(false)
  const [nameDelete, setNameDelete] = React.useState("")
  const handleOpenDelete = (id: string, name: string) => {
    setIdDelete(id)
    setNameDelete(name)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setIdDelete("")
    setNameDelete("")
    setOpenDelete(false)
  }
  const handleDeleteSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await deleteClass(idDelete)
      alert("Kelas buyer berhasil dihapus")
      refreshData()
      handleCloseDelete()
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus kelas buyer")
      handleCloseDelete()
    }
  }

  return (
    <div className="">
      <AppTable
        data={classes}
        columns={columns}
        searchPlaceholder="Cari nama class..."
        onSearch={onSearch}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        meta={meta}
      />
      {modalEdit && (
        <AppModal title="Edit Kelas Buyer" onClose={handleCloseEdit}>
          <form
            className="grid grid-cols-2 gap-3 space-y-3"
            onSubmit={handleEditSubmit}
          >
            <InputText label="Nama Kelas" value={name} onChange={setName} />
            <InputPercent
              label="Diskon Kelas"
              value={disc}
              onChange={setDisc}
            />
            <InputNumber
              label="Minimal Order"
              value={minOrder}
              onChange={setMinOrder}
            />
            <InputCurrency
              label="Minimal Nilai Transaksi"
              value={minTransactionValue}
              onChange={setMinTransactionValue}
            />
            <InputNumber
              label="Minggu"
              value={week}
              onChange={setWeek}
              helper={false}
            />
            <InputSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
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
      {openDelete && (
        <AppModal onClose={handleCloseDelete} title="Hapus Kelas">
          <form method="delete" onSubmit={handleDeleteSubmit}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Trash2 className="mx-auto mb-3 text-red-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menghapus Kelas ini?</p>
                  <h3 className="text-xl font-bold">
                    {nameDelete ?? "Kelas"}%
                  </h3>
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
