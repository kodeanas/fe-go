"use client"

import { AppCardSmall, AppCardSummary } from "@/components/globals/app-card"
import PieChartCustom from "@/components/globals/app-chart"
import PieChartStatus from "@/components/globals/app-chart"
import {
  CircleStop,
  Disc,
  Download,
  FileQuestion,
  SaveAll,
  StopCircle,
  StopCircleIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import App from "next/app"
import React, { Suspense, useEffect, useState } from "react"
import TableBelum from "./tableBelum"
import TableSudah from "./tableSudah"
import {
  finishBast,
  getBastProductDiscrepancy,
  getBastProductScanned,
  getBastSummary,
} from "@/services/inbound/scanIn/bast/BastService"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  DetailBastSummaryResponse,
  DiscrepancyItemResponse,
  ScannedItemResponse,
} from "@/services/inbound/scanIn/bast/BastType"
import { formatRibuan } from "@/lib/utils"
import { Meta } from "@/services/Meta"
import { getClasses } from "@/services/class/ClassService"
import { AppModal } from "@/components/globals/app-modal"

function BastDetailContent() {
  // Data Summary
  const idData = useParams().id
  const [summaryData, setSummaryData] =
    useState<DetailBastSummaryResponse | null>(null)
  // console.log("ID Data:", idData)
  const dataSummary = async () => {
    try {
      const data = await getBastSummary(idData as string)
      setSummaryData(data.data)
    } catch (error) {
      console.error("Error fetching summary data:", error)
    }
  }
  useEffect(() => {
    if (idData) {
      dataSummary()
    }
  }, [idData])

  // Data Good, Damaged, Abnormal, Non
  const barangGood = [
    { label: "Total Item", value: summaryData?.good.total_item ?? 0 },
    {
      label: "Total Price",
      value: `Rp ${formatRibuan(summaryData?.good.total_price ?? 0)}`,
    },
    { label: "Persentase", value: `${summaryData?.good.persentase ?? 0}%` },
  ]
  const barangDamaged = [
    { label: "Total Item", value: summaryData?.damaged.total_item ?? 0 },
    {
      label: "Total Price",
      value: `Rp ${formatRibuan(summaryData?.damaged.total_price ?? 0)}`,
    },
    { label: "Persentase", value: `${summaryData?.damaged.persentase ?? 0}%` },
  ]
  const barangAbnormal = [
    { label: "Total Item", value: summaryData?.abnormal.total_item ?? 0 },
    {
      label: "Total Price",
      value: `Rp ${formatRibuan(summaryData?.abnormal.total_price ?? 0)}`,
    },
    { label: "Persentase", value: `${summaryData?.abnormal.persentase ?? 0}%` },
  ]
  const barangNon = [
    { label: "Total Item", value: summaryData?.non.total_item ?? 0 },
    {
      label: "Total Price",
      value: `Rp ${formatRibuan(summaryData?.non.total_price ?? 0)}`,
    },
    { label: "Persentase", value: `${summaryData?.non.persentase ?? 0}%` },
  ]
  const barangDiscrepancy = [
    {
      label: "Total Item",
      value: summaryData?.discrepancy.total_item ?? 0,
    },
    {
      label: "Total Price",
      value: `Rp ${formatRibuan(summaryData?.discrepancy.total_price ?? 0)}`,
    },
    {
      label: "Persentase",
      value: `${summaryData?.discrepancy.persentase ?? 0}%`,
    },
  ]

  // Data Discrepancy Product
  const router = useRouter()
  const searchParams = useSearchParams()
  const [discrepancyItem, setDiscrepancyItem] = React.useState<
    DiscrepancyItemResponse[]
  >([])
  const [meta, setMeta] = React.useState<Meta | null>(null)
  const [search, setSearch] = React.useState("")
  // Ambil dari query params jika ada (dengan prefix discrepancy_)
  const initialSearch = searchParams.get("discrepancy_search") || ""
  const initialPage = parseInt(searchParams.get("discrepancy_page") || "1", 10)
  const initialLimit = parseInt(
    searchParams.get("discrepancy_limit") || "5",
    10
  )
  const [page, setPage] = React.useState(initialPage)
  const [limit, setLimit] = React.useState(initialLimit)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set("discrepancy_search", search)
    else params.delete("discrepancy_search")
    params.set("discrepancy_page", String(page))
    params.set("discrepancy_limit", String(limit))
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [search, page, limit, router])
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  const fetchData = async () => {
    try {
      const data = await getBastProductDiscrepancy(idData as string, {
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setDiscrepancyItem(data.data)
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
  }, [debouncedSearch, page, limit])

  // Data Scanned Product
  const [scannedItem, setScannedItem] = React.useState<ScannedItemResponse[]>(
    []
  )
  const [metaScanned, setMetaScanned] = React.useState<Meta | null>(null)
  // Ambil dari query params jika ada (dengan prefix scanned_)
  const initialSearchScanned = searchParams.get("scanned_search") || ""
  const initialPageScanned = parseInt(
    searchParams.get("scanned_page") || "1",
    10
  )
  const initialLimitScanned = parseInt(
    searchParams.get("scanned_limit") || "5",
    10
  )
  const [searchScanned, setSearchScanned] = React.useState(initialSearchScanned)
  const [pageScanned, setPageScanned] = React.useState(initialPageScanned)
  const [limitScanned, setLimitScanned] = React.useState(initialLimitScanned)
  const [debouncedSearchScanned, setDebouncedSearchScanned] =
    React.useState(searchScanned)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchScanned) params.set("scanned_search", searchScanned)
    else params.delete("scanned_search")
    params.set("scanned_page", String(pageScanned))
    params.set("scanned_limit", String(limitScanned))
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [searchScanned, pageScanned, limitScanned, router])

  const fetchDataScanned = async () => {
    try {
      const data = await getBastProductScanned(idData as string, {
        search: debouncedSearchScanned || undefined,
        page: pageScanned,
        limit: limitScanned,
      })
      setScannedItem(data.data)
      setMetaScanned(data.meta)
      console.log("Scanned data:", data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchScanned(searchScanned)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchScanned])

  useEffect(() => {
    fetchDataScanned()
  }, [debouncedSearchScanned, pageScanned, limitScanned])

  // Tab
  const [activeTab, setActiveTab] = React.useState(0)
  const tabs = [
    {
      label: "Belom di Scan",
      content: (
        <TableBelum
          discrepancyItem={discrepancyItem}
          meta={meta}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          refreshData={fetchData}
          onSearch={setSearch}
        />
      ),
    },
    {
      label: "Terscan",
      content: (
        <TableSudah
          scannedItem={scannedItem}
          meta={metaScanned}
          page={pageScanned}
          limit={limitScanned}
          setPage={setPageScanned}
          setLimit={setLimitScanned}
          refreshData={fetchDataScanned}
          onSearch={setSearchScanned}
        />
      ),
    },
  ]

  // Finish
  const [modalFinish, setModalFinish] = React.useState(false)
  const handleOpen = () => {
    setModalFinish(true)
  }
  const handleClose = () => {
    setModalFinish(false)
  }
  const handleFinsihSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const data = await finishBast(idData as string)
      handleClose()
      fetchData()
      alert("BAST berhasil diselesaikan")
    } catch (error) {
      alert("Gagal menyelesaikan BAST")
      handleClose()
      fetchData()
    }
  }
  return (
    <div className="space-y-5">
      <AppCardSmall
        code={summaryData?.code}
        nameFile={summaryData?.file_name}
        totalItem={summaryData?.file_item}
        totalPrice={summaryData?.file_price}
      >
        <div className="flex items-center gap-5">
          <div className="bg-blue rounded-xl bg-blue-400 px-5 py-1 text-lg font-semibold text-white uppercase">
            {summaryData?.status}
          </div>
          <button
            onClick={handleOpen}
            className="rounded-lg bg-green-500 p-3 text-white hover:cursor-pointer hover:bg-green-600"
          >
            <SaveAll size={25} className="text-white" />
          </button>
        </div>
      </AppCardSmall>
      <div className="grid gap-5 lg:grid-cols-3 2xl:grid-cols-5">
        <AppCardSummary
          title="Barang Good"
          data={barangGood}
          icon={<ThumbsUp size={25} className="text-white" />}
        />
        <AppCardSummary
          title="Barang Damaged"
          data={barangDamaged}
          icon={<ThumbsDown size={25} className="text-white" />}
        />
        <AppCardSummary
          title="Barang Abnormal"
          data={barangAbnormal}
          icon={<FileQuestion size={25} className="text-white" />}
        />
        <AppCardSummary
          title="Barang Non"
          data={barangNon}
          icon={<StopCircleIcon size={25} className="text-white" />}
        />
        <AppCardSummary
          title="Total Discrepancy"
          data={barangDiscrepancy}
          icon={<SaveAll size={25} className="text-white" />}
        />
      </div>
      <div className="grid grid-cols-3 items-start gap-5">
        <div className="space-y-5">
          <AppCardSummary
            title="Total Item"
            data={[
              { label: "Total Item", value: summaryData?.file_item ?? 0 },
              {
                label: "Total Price",
                value: `Rp ${formatRibuan(summaryData?.file_price ?? 0)}`,
              },
              { label: "Persentase", value: "100%" },
            ]}
            icon={<SaveAll size={25} className="text-white" />}
          />
          <div className="rounded-lg border-2 border-gray-300 p-5">
            <button className="font-semibolds flex w-full justify-center rounded-lg bg-blue-400 py-1 text-white hover:cursor-pointer hover:bg-blue-600">
              <div className="flex items-center gap-3">
                <Download size={16} />
                <p>Export</p>
              </div>
            </button>
          </div>
        </div>
        <PieChartCustom
          title="Item"
          innerRadius={60}
          data={[
            { name: "Good", value: summaryData?.good.total_item ?? 0 },
            { name: "Damaged", value: summaryData?.damaged.total_item ?? 0 },
            { name: "Abnormal", value: summaryData?.abnormal.total_item ?? 0 },
            { name: "Non", value: summaryData?.non.total_item ?? 0 },
            {
              name: "Discrepancy",
              value: summaryData?.discrepancy.total_item ?? 0,
            },
          ]}
          colors={["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#f43f5e"]} // Hijau & Merah
        />
        <PieChartCustom
          title="Price"
          innerRadius={60}
          colors={["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#f43f5e"]} // Hijau & Merah
          data={[
            { name: "Good", value: summaryData?.good.total_price ?? 0 },
            { name: "Damaged", value: summaryData?.damaged.total_price ?? 0 },
            { name: "Abnormal", value: summaryData?.abnormal.total_price ?? 0 },
            { name: "Non", value: summaryData?.non.total_price ?? 0 },
            {
              name: "Discrepancy",
              value: summaryData?.discrepancy.total_price ?? 0,
            },
          ]}
        />
      </div>
      <div className="pt-10">
        <div className="flex justify-center border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-2 text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                activeTab === index
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex animate-in justify-center rounded-lg p-4 duration-300 fade-in">
        {tabs[activeTab].content}
      </div>
      {/* Modal Finish */}
      {modalFinish && (
        <AppModal
          onClose={handleClose}
          title={`Finish BAST ${summaryData?.file_name || ""}`}
        >
          <form method="post" onSubmit={handleFinsihSubmit}>
            <div className="space-y-5">
              <div className="w-full justify-center text-center">
                <Disc className="mx-auto mb-3 text-green-500" size={48} />
                <div className="space-y-1">
                  <p>Anda yakin ingin menyelesaikan BAST ini?</p>
                  <h3 className="text-xl font-bold">
                    {summaryData?.file_name ?? ""}
                  </h3>
                </div>
              </div>
              <div className="w-full space-y-2">
                <button
                  type="submit"
                  className="w-full rounded-lg border-2 border-gray-400 bg-gray-300 text-gray-600 hover:cursor-pointer hover:bg-gray-700 hover:text-gray-200 dark:bg-transparent"
                >
                  Selesaikan
                </button>
                <button
                  onClick={handleClose}
                  className="w-full rounded-lg border-2 border-green-400 bg-green-600 text-white hover:cursor-pointer hover:bg-transparent hover:text-green-600"
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

export default function BastDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BastDetailContent />
    </Suspense>
  )
}
