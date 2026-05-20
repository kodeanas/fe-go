"use client"
import {
  AppCardMatrix,
  AppCardSmall,
  AppCardSummary,
} from "@/components/globals/app-card"
import { formatRibuan } from "@/lib/utils"
import { getRakDisplaySummary } from "@/services/inventory/display/DisplayService"
import { RakDisplaySummaryResponse } from "@/services/inventory/display/DisplayType"
import { PenSquare, Send } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"

function DetailRakDisplayContent() {
  const idRackDisplay = useParams().id
  const [summary, setSummary] =
    React.useState<RakDisplaySummaryResponse | null>(null)

  const getSummary = async () => {
    try {
      const data = await getRakDisplaySummary(idRackDisplay as string)
      setSummary(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (idRackDisplay) {
      getSummary()
    }
  }, [idRackDisplay])

  return (
    <div className="space-y-5">
      <AppCardSmall
        code={summary?.code ?? "Code"}
        nameFile={summary?.name ?? "Nama Rak Display"}
      >
        <div className="flex items-center gap-5">
          <Link
            href={`#`}
            className="rounded-lg bg-yellow-400 p-3 hover:cursor-pointer hover:bg-yellow-500"
          >
            <PenSquare size={20} className="text-white" />
          </Link>
          <Link
            href={`#`}
            className="rounded-lg bg-green-400 p-3 hover:cursor-pointer hover:bg-green-500"
          >
            <Send size={20} className="text-white" />
          </Link>
        </div>
      </AppCardSmall>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-1">
          <AppCardSummary
            title="Total Item"
            labelWidth="150px"
            data={[
              { label: "Item di Rak", value: summary?.total_item ?? 0 },
              {
                label: "Harga Gudang",
                value: `Rp ${summary ? formatRibuan(summary.total_price) : "0"}`,
              },
              {
                label: "Harga Asal",
                value: `Rp ${summary ? formatRibuan(summary.total_price_warehouse) : "0"}`,
              },
            ]}
          />
        </div>
        <div className="col-span-2">
          <AppCardMatrix
            title="Summary Rak OTOMOTIF"
            columns={["Item", "Harga Gudang", "Harga Asal"]}
            rows={[
              {
                rowLabel: "Otomotif",
                values: ["10", "Rp 150.000.000", "Rp 200.000.000"],
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default function DetailRakDisplayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailRakDisplayContent />
    </Suspense>
  )
}
