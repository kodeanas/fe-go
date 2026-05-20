"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { PaperclipIcon, Plus } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import BulkTable from "./table"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  BulkResponse,
  GetSummaryBulkResponse,
} from "@/services/inbound/scanIn/bulk/BulkType"
import { Meta } from "@/services/Meta"
import {
  getBulkList,
  getSummaryBulk,
} from "@/services/inbound/scanIn/bulk/BulkService"
import { formatRibuan } from "@/lib/utils"

function BulkContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bulk, setBulk] = React.useState<BulkResponse[]>([])
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
      const data = await getBulkList({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setBulk(data.data)
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

  // Summary
  const [summary, setSummary] = React.useState<GetSummaryBulkResponse | null>(
    null
  )

  const fetchSummary = async () => {
    try {
      const data = await getSummaryBulk()
      setSummary(data.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchSummary()
  }, [])
  return (
    <div className="space-y-5">
      <AppCardSummary
        title="Total Dokumen Masuk"
        labelWidth="300px"
        icon={<PaperclipIcon size={24} className="text-white" />}
        data={[
          {
            label: "Dokumen terupload",
            value: summary?.total_document_upload || 0,
          },
          {
            label: "Produk Masuk",
            value: summary?.total_product_masuk || 0,
          },
          {
            label: "Harga Total Masuk",
            value: `Rp ${formatRibuan(summary?.total_harga_masuk || 0)}`,
          },
        ]}
      />
      <div className="flex w-full justify-end">
        <Link href="/bulk/tambah">
          <button className="flex items-center gap-3 rounded-lg bg-blue-400 px-3 py-2 text-white hover:cursor-pointer hover:bg-blue-700">
            <Plus size={16} />
            <p>Upload</p>
          </button>
        </Link>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <BulkTable
          bulk={bulk}
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

export default function BulkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BulkContent />
    </Suspense>
  )
}
