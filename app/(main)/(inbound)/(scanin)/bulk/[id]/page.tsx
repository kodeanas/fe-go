"use client"

import { AppCardMatrix, AppCardSmall } from "@/components/globals/app-card"
import { Download, Layers } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import BulkProductTable from "./table"
import { GetDetailSummaryBulkResponse } from "@/services/inbound/scanIn/bulk/BulkType"
import { useParams } from "next/navigation"
import { getDetailSummaryBulk } from "@/services/inbound/scanIn/bulk/BulkService"
import { formatRibuan } from "@/lib/utils"

function DetailBulkContent() {
  const idBulk = useParams().id || ""
  const [summary, setSummary] = React.useState<GetDetailSummaryBulkResponse[]>(
    []
  )
  const fetchSummary = async () => {
    try {
      const data = await getDetailSummaryBulk(idBulk as string)
      setSummary(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (idBulk) {
      fetchSummary()
    }
  }, [idBulk])

  const matrixRows = summary.map((item) => {
    return {
      // Menghapus 'category/' jika ada, misal: "category/Fashion" -> "Fashion"
      rowLabel: item.label.replace("category/", ""),
      // Urutan wajib sama dengan columns: ["Item", "Harga Gudang", "Harga Asal"]
      values: [
        item.item.toString(),
        `Rp ${formatRibuan(item.price_warehouse)}`,
        `Rp ${formatRibuan(item.price)}`,
      ],
    }
  })
  return (
    <div className="w-full space-y-5">
      <AppCardSmall
        code="BULKCODE001"
        nameFile="Nama File"
        totalPrice="Rp 150.000.000"
        totalItem="10"
      >
        <button className="rounded-lg bg-blue-400 p-3 hover:cursor-pointer hover:bg-blue-600">
          <Download className="h-5 w-5 text-white" />
        </button>
      </AppCardSmall>
      <AppCardMatrix
        title="Summary Bulk"
        columns={["Item", "Harga Gudang", "Harga Asal"]} // Header atas
        rows={matrixRows}
      />
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <BulkProductTable />
      </div>
    </div>
  )
}

export default function DetailBulkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailBulkContent />
    </Suspense>
  )
}
