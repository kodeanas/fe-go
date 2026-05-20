"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import React, { Suspense, useEffect } from "react"
import SatuanTable from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { SatuanResponse } from "@/services/inbound/scanIn/satuan/SatuanType"
import { Meta } from "@/services/Meta"
import { getSatuan } from "@/services/inbound/scanIn/satuan/SatuanService"

function SatuanContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [manuals, setManuals] = React.useState<SatuanResponse[]>([])
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
      const data = await getSatuan({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setManuals(data.data)
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

  // Dummy Summary
  const summaryStatus = [
    { label: "Total Data", value: 100 },
    { label: "Data Valid", value: 80, color: "text-green-600" },
    { label: "Data Invalid", value: 20, color: "text-red-600" },
  ]

  const summaryStock = [
    { label: "Barang Masuk", value: "1.250 Unit" },
    { label: "Barang Keluar", value: "450 Unit", color: "text-orange-600" },
  ]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <AppCardSummary title="Ringkasan Data" data={summaryStatus} />
        <AppCardSummary
          title="Laporan Stok"
          icon={<FileText size={20} className="text-white" />}
          data={summaryStock}
          labelWidth="150px"
        />
      </div>
      <div className="flex justify-end">
        <Link
          href="/satuan/tambah"
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Plus size={16} />
          <p>Input Manual</p>
        </Link>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-3">
        <SatuanTable
          satuan={manuals}
          onSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
          refreshData={fetchData}
        />
      </div>
    </div>
  )
}

export default function SatuanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SatuanContent />
    </Suspense>
  )
}
