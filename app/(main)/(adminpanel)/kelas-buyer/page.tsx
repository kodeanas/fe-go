"use client"

import { AppCardSecondary } from "@/components/globals/app-card"
import { Plus, User } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import TableKelasBuyer from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { ClassResponse } from "@/services/class/ClassType"
import { Meta } from "@/services/Meta"
import { createClass, getClasses, upClass } from "@/services/class/ClassService"
import { AppModal } from "@/components/globals/app-modal"
import {
  InputCurrency,
  InputNumber,
  InputPercent,
  InputSelect,
  InputText,
} from "@/components/globals/app-input"

function KelasBuyerContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [classes, setClasses] = React.useState<ClassResponse[]>([])
  const [meta, setMeta] = React.useState<Meta | null>(null)
  const [search, setSearch] = React.useState("")
  // Ambil dari query params jika ada
  const initialSearch = searchParams.get("name") || ""
  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const initialLimit = parseInt(searchParams.get("limit") || "5", 10)
  const [page, setPage] = React.useState(initialPage)
  const [limit, setLimit] = React.useState(initialLimit)
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    if (page) params.set("page", String(page))
    if (limit) params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [search, page, limit, router])
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  const fetchData = async () => {
    try {
      const data = await getClasses({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setClasses(data.data)
      setMeta(data.meta)
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchData()
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    params.set("page", String(page))
    params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [debouncedSearch, page, limit])

  // Modal Create
  const [modalCreate, setModalCreate] = React.useState(false)
  const [name, setName] = React.useState("")
  const [disc, setDisc] = React.useState(0)
  const [minOrder, setMinOrder] = React.useState(0)
  const [minTransactionValue, setMinTransactionValue] = React.useState(0)
  const [week, setWeek] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")

  const handleCreateOpen = () => {
    setName("")
    setDisc(0)
    setMinOrder(0)
    setMinTransactionValue(0)
    setWeek(0)
    setStatus("active")
    setModalCreate(true)
  }
  const handleCreateClose = () => {
    setModalCreate(false)
    setName("")
    setDisc(0)
    setMinOrder(0)
    setMinTransactionValue(0)
    setWeek(0)
    setStatus("active")
  }

  const handleCreateSubmit = async () => {
    try {
      const data = await createClass({
        name,
        disc,
        min_order: minOrder,
        min_transaction_value: minTransactionValue,
        week,
        status,
      })
      alert("Kelas buyer berhasil dibuat")
      handleCreateClose()
      fetchData()
    } catch (error) {
      console.error(error)
      alert("Gagal membuat kelas buyer")
    }
  }
  return (
    <div className="space-y-5">
      <AppCardSecondary
        title="Total Kelas"
        number={10}
        icon={<User className="text-white" />}
      >
        <button
          onClick={handleCreateOpen}
          className="flex w-full items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </AppCardSecondary>
      <div className="col-span-1 rounded-lg border-2 border-gray-300 p-3 xl:col-span-2">
        <TableKelasBuyer
          classes={classes}
          onSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
          refreshData={fetchData}
        />
      </div>
      {modalCreate && (
        <AppModal title="Tambah Kelas Buyer" onClose={handleCreateClose}>
          <form
            className="grid grid-cols-2 gap-3 space-y-3"
            onSubmit={handleCreateSubmit}
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
                  onClick={handleCreateClose}
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
    </div>
  )
}

export default function KelasBuyerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KelasBuyerContent />
    </Suspense>
  )
}
