"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { InputText } from "@/components/globals/app-input"
import { AppModal } from "@/components/globals/app-modal"
import {
  CreateRakDisplay,
  getRakDisplays,
} from "@/services/inventory/display/DisplayService"
import { RakDisplayResponse } from "@/services/inventory/display/DisplayType"
import { Meta } from "@/services/Meta"
import { FilePen, Plus, Text } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import TableRakDisplay from "./table"

function RakDisplayContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rakDisplays, setRakDisplays] = React.useState<RakDisplayResponse[]>([])
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
      const data = await getRakDisplays({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setRakDisplays(data.data)
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

  // Modal Create Rak
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const handleOpenCreate = () => {
    setName("")
    setIsModalOpen(true)
  }
  const handleCloseCreate = () => {
    setIsModalOpen(false)
    setName("")
  }
  const handleSubmitCreateRak = async (e: any) => {
    e.preventDefault()
    try {
      const data = await CreateRakDisplay({
        name,
      })
      alert("Rak Display berhasil dibuat")
      handleCloseCreate()
      fetchData()
    } catch (error) {
      console.error(error)
      alert("Gagal membuat Rak Display")
      handleCloseCreate()
    }
  }
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5">
        {/* <AppCardSummary
          title="Total Rak Kemarin"
          labelWidth="200px"
          data={[
            {
              label: "Rak Total",
              value: "150 Rak",
            },
            {
              label: "Total Item",
              value: "1500 Item",
            },
            {
              label: "Total Harga",
              value: "Rp 150.000.000",
            },
          ]}
        /> */}
        <AppCardSummary
          title="Total Rak Hari Ini"
          labelWidth="200px"
          data={[
            {
              label: "Rak Total",
              value: "160 Rak",
            },
            {
              label: "Total Item",
              value: "1600 Item",
            },
            {
              label: "Total Harga",
              value: "Rp 160.000.000",
            },
          ]}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-3 rounded bg-blue-400 px-4 py-2 font-semibold text-white hover:cursor-pointer hover:bg-blue-500"
        >
          <Plus size={16} className="text-white" />
          Tambah Rak
        </button>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <TableRakDisplay
          rackDisplays={rakDisplays}
          onSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
          refreshData={fetchData}
        />
      </div>

      {/* Create */}
      {isModalOpen && (
        <AppModal title="Buat Rak Display" onClose={handleCloseCreate}>
          <div className="space-y-5">
            <div className="text-center">
              <div className="flex w-full justify-center">
                <div className="rounded-full bg-blue-400 p-3">
                  <FilePen size={24} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold">Buat Rak Display</h2>
              <p className="text-sm text-gray-500">
                Masukkan nama rak display yang ingin dibuat.
              </p>
              {/* KALIMAT PERINGATAN */}
              <p className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-600">
                <strong>Perhatian:</strong> Rak ini akan nantinya akan menjadi
                patokan tujuan Bag Staging saat pengiriman ke area display.
              </p>
            </div>
            <form
              action=""
              method="post"
              className="space-y-5"
              onSubmit={handleSubmitCreateRak}
            >
              <InputText
                label="Nama Rak"
                value={name}
                onChange={setName}
                placeholder="Masukkan nama rak display"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCreate}
                  className="rounded-lg border border-gray-400 px-5 py-2 font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-100"
                >
                  {" "}
                  Kembali
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-400 px-5 py-2 font-semibold text-white hover:cursor-pointer hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </AppModal>
      )}
    </div>
  )
}

export default function RakDisplayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RakDisplayContent />
    </Suspense>
  )
}
