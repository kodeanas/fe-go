"use client"

import { AppCard } from "@/components/globals/app-card"
import { PercentCircle } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import TablePpn from "./table"
import { createPpn, getPpn } from "@/services/ppn/PpnService"
import { PpnResponse } from "@/services/ppn/PpnType"
import { Meta } from "@/services/Meta"
import { useRouter, useSearchParams } from "next/navigation"
import { AppModal } from "@/components/globals/app-modal"

function PpnContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ppn, setPpn] = React.useState<PpnResponse[]>([])
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
      const data = await getPpn({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setPpn(data.data)
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

  //   Modal Craete
  const [modalCreate, setModalCreate] = React.useState(false)
  const [tax, setTax] = React.useState(0)
  const [isActive, setIsActive] = React.useState(true)
  const handleOpenCreate = () => {
    setTax(0)
    setIsActive(true)
    setModalCreate(true)
  }
  const handleCloseCreate = () => {
    setTax(0)
    setIsActive(true)
    setModalCreate(false)
  }
  const handleSubmitCreate = async () => {
    try {
      const data = await createPpn({
        tax,
        is_active: isActive,
      })
      alert("Berhasil membuat PPN")
      handleCloseCreate()
      fetchData()
    } catch (error) {
      alert("Gagal membuat PPN")
      console.error(error)
      handleCloseCreate()
    }
  }
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="col-span-1 space-y-3">
        <AppCard
          icon={
            <PercentCircle className="m-auto h-6 w-6 font-bold text-white" />
          }
          number={meta?.pagination.total_items || 0}
          title="Total Ppn"
        />
        <div className="w-full rounded-lg border-2 border-gray-300 px-4 py-3">
          <button
            onClick={handleOpenCreate}
            className="w-full rounded-lg bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
      <div className="col-span-2 rounded-lg border-2 border-gray-300 p-3">
        <TablePpn
          //   refreshData={fetchData}
          taxes={ppn}
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
          refreshData={fetchData}
        />
      </div>
      {modalCreate && (
        <AppModal title="Tambah PPN" onClose={handleCloseCreate}>
          <form
            action=""
            method="post"
            className="grid grid-cols-2 gap-3"
            onSubmit={handleSubmitCreate}
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
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </select>
            </div>
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

export default function PpnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PpnContent />
    </Suspense>
  )
}
