"use client"

import { AppCardSecondary } from "@/components/globals/app-card"
import { Plus, Users } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import BuyerTable from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { BuyerResponse } from "@/services/masterData/buyer/BuyerType"
import { Meta } from "@/services/Meta"
import {
  createBuyer,
  getBuyers,
} from "@/services/masterData/buyer/BuyerService"
import { AppModal } from "@/components/globals/app-modal"
import { InputText } from "@/components/globals/app-input"

function BuyerContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [buyers, setBuyers] = React.useState<BuyerResponse[]>([])
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
      const data = await getBuyers({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setBuyers(data.data)
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
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [address, setAddress] = React.useState("")

  const handleOpenCreate = () => {
    setName("")
    setPhone("")
    setEmail("")
    setAddress("")
    setModalCreate(true)
  }

  const handleCloseCreate = () => {
    setModalCreate(false)
    setName("")
    setPhone("")
    setEmail("")
    setAddress("")
  }

  const handleCreateSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await createBuyer({
        name,
        phone,
        email,
        address,
      })
      alert("Buyer berhasil ditambahkan")
      handleCloseCreate()
      fetchData()
    } catch (error) {
      console.error(error)
      alert("Gagal menambahkan buyer")
      handleCloseCreate()
      fetchData()
    }
  }

  return (
    <div className="space-y-5">
      <AppCardSecondary
        title="Buyer"
        icon={<Users className="text-white" />}
        number={100}
      >
        <button
          onClick={handleOpenCreate}
          className="flex w-full items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </AppCardSecondary>
      <div className="col-span-1 rounded-lg border-2 border-gray-300 p-3 xl:col-span-2">
        <BuyerTable
          buyers={buyers}
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
        <AppModal title="Tambah Buyer" onClose={handleCloseCreate}>
          <form
            action=""
            method="post"
            className="grid grid-cols-2 gap-3 space-y-3"
            onSubmit={handleCreateSubmit}
          >
            <InputText label="Nama Buyer" value={name} onChange={setName} />
            <InputText label="Phone" value={phone} onChange={setPhone} />
            <InputText label="Email" value={email} onChange={setEmail} />
            <InputText label="Address" value={address} onChange={setAddress} />
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseCreate}
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
    </div>
  )
}

export default function BuyerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyerContent />
    </Suspense>
  )
}
