import { Calendar, User } from "lucide-react"
import React from "react"

type CardProps = {
  title?: string
  number?: number
  icon?: React.ReactNode
}

export function AppCard({ title, number, icon }: CardProps) {
  return (
    <div className="h-auto w-full space-y-2 rounded-md border-2 border-gray-300 p-4">
      <h2 className="text-lg font-semibold">{title ?? "Total User"}</h2>
      <div className="flex items-center gap-5">
        <div className="rounded-full bg-blue-500 p-2">{icon ?? ""}</div>
        <p className="text-2xl font-bold">{number ?? 0}</p>
      </div>
    </div>
  )
}

type CardSecondaryProps = {
  title?: string
  number?: number
  icon?: React.ReactNode
  children?: React.ReactNode
}
export function AppCardSecondary({
  title,
  number,
  icon,
  children,
}: CardSecondaryProps) {
  return (
    <div className="h-auto w-full space-y-2 rounded-md border-2 border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title ?? "Total User"}</h2>
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-blue-500 p-3 text-white">
              {icon ?? <User className="text-white" />}
            </div>
            <p className="text-2xl font-bold">{number ?? 0}</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

interface InfoDetailItem {
  label: string
  value: string | number | React.ReactNode
}

interface AppCardInfoDetailProps {
  title?: string
  data: InfoDetailItem[]
  icon?: React.ReactNode // Prop untuk icon di sebelah header
}

export function AppCardInfoDetail({
  title = "Detail Buyer",
  data,
  icon,
}: AppCardInfoDetailProps) {
  return (
    <div className="w-full space-y-3 rounded-md border-2 border-gray-300 p-4">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        {/* Lingkaran Icon */}
        <div className="rounded-full bg-blue-400 p-3 text-white">
          {/* Jika icon dikirim lewat props, tampilkan itu. Jika tidak, pakai User default */}
          {icon ? icon : <User size={20} />}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Content Section (List Data) */}
      <div className="p-2">
        {/* Grid 3 kolom: Label - Titik Dua - Value */}
        <div className="grid grid-cols-[100px_min-content_1fr] items-start gap-x-2 gap-y-4 text-sm">
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {/* Kolom Label */}
              <span className="font-semibold text-gray-700">{item.label}</span>

              {/* Kolom Titik Dua */}
              <span className="text-gray-500">:</span>

              {/* Kolom Value */}
              <span className="fonts-medium break-words text-gray-900">
                {item.value || "-"}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

interface SummaryItem {
  label: string
  value: string | number
  color?: string // Opsional: untuk warna teks value (misal: text-green-600)
}

interface AppCardSummaryProps {
  title?: string
  icon?: React.ReactNode
  data: SummaryItem[]
  labelWidth?: string // Opsional: jika ingin atur lebar kolom label
}

export function AppCardSummary({
  title = "Data Summary",
  icon,
  data,
  labelWidth = "200px", // Default 200px seperti permintaanmu
}: AppCardSummaryProps) {
  return (
    <div className="w-full space-y-5 rounded-md border-2 border-gray-300 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-400 p-3 shadow-sm">
          {icon ? icon : <Calendar size={20} className="text-white" />}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {/* Grid Content */}
      <div
        className="grid gap-x-2 gap-y-3 text-lg"
        style={{ gridTemplateColumns: `${labelWidth} min-content 1fr` }}
      >
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <span className="font-semibold text-gray-700">{item.label}</span>
            <span className="text-gray-500">:</span>
            <span className={`font-medium ${item.color || "text-gray-900"}`}>
              {item.value}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
