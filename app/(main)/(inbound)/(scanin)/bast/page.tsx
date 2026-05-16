"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import React, { Suspense, useEffect } from "react"
import BastTable from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { BastResponse } from "@/services/inbound/scanIn/bast/BastType"
import { Meta } from "@/services/Meta"
import { getBastList } from "@/services/inbound/scanIn/bast/BastService"

const dataDokumen = [
  { label: "Total Dokumen Masuk", value: 150 },
  { label: "Total Dokumen TerScan", value: 120 },
]

const dataProduk = [
  { label: "Total Good", value: "20 / Rp 1.000.000" },
  { label: "Total Damaged", value: "15 / Rp 500.000" },
  { label: "Total Abnormal", value: "10 / Rp 200.000" },
  { label: "Total Non", value: "5 / Rp 100.000" },
]

function BastContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bast, setBast] = React.useState<BastResponse[]>([])
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
      const data = await getBastList({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setBast(data.data)
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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <AppCardSummary
          labelWidth="250px"
          title="Dokumen Masuk dan TerScan"
          icon={<FileText className="text-white" />}
          data={dataDokumen}
        />
        <AppCardSummary
          title="Produk Terscan"
          icon={<FileText className="text-white" />}
          data={dataProduk}
        />
      </div>
      <div className="flex justify-end">
        <Link
          href="/bast/upload"
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Plus size={16} />
          <p>Upload Excel</p>
        </Link>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <BastTable
          bast={bast}
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

export default function BastPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BastContent />
    </Suspense>
  )
}
