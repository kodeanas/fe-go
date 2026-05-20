"use client"

import { AppCardSummary } from "@/components/globals/app-card"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import React, { Suspense, useEffect } from "react"
import BastTable from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import {
  BastResponse,
  SummaryAllBastResponse,
} from "@/services/inbound/scanIn/bast/BastType"
import { Meta } from "@/services/Meta"
import {
  getBastList,
  getSummaryAllBast,
} from "@/services/inbound/scanIn/bast/BastService"

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

  // Summary
  const [summaryData, setSummaryData] =
    React.useState<SummaryAllBastResponse | null>(null)
  const fetchSummary = async () => {
    try {
      const data = await getSummaryAllBast()
      setSummaryData(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <AppCardSummary
          labelWidth="250px"
          title="Dokumen Masuk dan TerScan"
          icon={<FileText className="text-white" />}
          data={[
            {
              label: "Total Dokumen Masuk",
              value: summaryData?.total_document_inbound || 0,
            },
            {
              label: "Total Dokumen TerScan",
              value: summaryData?.total_document_scanned || 0,
            },
          ]}
        />
        <AppCardSummary
          title="Produk Terscan"
          icon={<FileText className="text-white" />}
          labelWidth="250px"
          data={[
            {
              label: "Total Good",
              value: summaryData?.total_product_good || 0,
            },
            {
              label: "Total Damaged",
              value: summaryData?.total_product_damaged || 0,
            },
            {
              label: "Total Abnormal",
              value: summaryData?.total_product_abnormal || 0,
            },
            { label: "Total Non", value: summaryData?.total_product_non || 0 },
          ]}
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
