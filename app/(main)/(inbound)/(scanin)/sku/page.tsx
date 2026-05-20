"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { PaperclipIcon, Plus, PlusIcon } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import Link from "next/link"
import TableSku from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { SkuResponse } from "@/services/inbound/scanIn/sku/SkuType"
import { Meta } from "@/services/Meta"
import { getSkuList } from "@/services/inbound/scanIn/sku/SkuService"

function SkuContent() {
  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sku, setSku] = React.useState<SkuResponse[]>([])
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
      const data = await getSkuList({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setSku(data.data)
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
      <AppCardSummary
        title="Total Dokumen Masuk"
        labelWidth="300px"
        icon={<PaperclipIcon size={24} className="text-white" />}
        data={[
          {
            label: "Dokumen terupload",
            value: 10,
          },
          {
            label: "Produk Masuk",
            value: 150,
          },
          {
            label: "Harga Total Masuk",
            value: "Rp 150.000.000",
          },
        ]}
      />
      <div className="flex w-full justify-end">
        <Link href="/sku/tambah">
          <button className="flex items-center gap-3 rounded-lg bg-blue-400 px-3 py-2 text-white hover:cursor-pointer hover:bg-blue-600">
            <PlusIcon size={16} className="text-white" />
            Upload
          </button>
        </Link>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <TableSku
          sku={sku}
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

export default function SkuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkuContent />
    </Suspense>
  )
}
