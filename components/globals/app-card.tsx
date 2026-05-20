import { formatRibuan } from "@/lib/utils"
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
  data?: SummaryItem[]
  labelWidth?: string // Opsional: jika ingin atur lebar kolom label
}

export function AppCardSummary({
  title = "Data Summary",
  icon,
  data,
  labelWidth = "100px", // Default 200px seperti permintaanmu
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
        {data?.map((item, index) => (
          <React.Fragment key={index}>
            <span className="font-semibold">{item.label}</span>
            <span className="">:</span>
            <span
              className={`font-medium ${item.color || "text-gray-900 dark:text-white"}`}
            >
              {item.value}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface AppCardTableProps {
  code?: string
  nameFile?: string
  totalItem?: number | string
  totalPrice?: number | string
  children?: React.ReactNode
}

export function AppCardSmall({
  code,
  nameFile,
  totalItem,
  totalPrice,
  children,
}: AppCardTableProps) {
  return (
    <div className="w-full rounded-lg border-2 border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="pr-3">
            <h1 className="text-lg font-bold">{code ?? "Code"}</h1>
          </div>
          <div className="px-3">
            <p className="text-lg font-semibold">{nameFile ?? "Nama File"}</p>
          </div>
          <div className="flex flex-col px-3">
            <p className="text-lg">
              {totalItem && <>Total Item: {totalItem}</>}{" "}
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {typeof totalPrice === "number"
                ? `Rp ${formatRibuan(totalPrice)}`
                : totalPrice}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

// ===== CARD INPUT COMPONENT =====
interface InputFieldConfig {
  name: string
  label: string
  type: "text" | "number" | "currency" | "select" | "percent" | "date"
  value: any
  onChange: (value: any) => void
  placeholder?: string
  options?: { label: string; value: any }[] // untuk type select
  disabled?: boolean
  required?: boolean
  helper?: string // Helper text tambahan
}

interface AppCardInputProps {
  title?: string
  icon?: React.ReactNode
  fields: InputFieldConfig[]
  labelWidth?: string
  children?: React.ReactNode // untuk button atau elemen tambahan
}

export function AppCardInput({
  title = "Form Input",
  icon,
  fields,
  labelWidth = "150px",
  children,
}: AppCardInputProps) {
  const renderInput = (field: InputFieldConfig) => {
    const baseInputClass =
      "w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"

    // Default disabled adalah true jika tidak di-set
    const isDisabled = field.disabled ?? true

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            required={field.required}
            className={baseInputClass}
          />
        )

      case "number":
        return (
          <div className="space-y-1">
            <input
              type="number"
              name={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder={field.placeholder}
              disabled={isDisabled}
              required={field.required}
              className={baseInputClass}
            />
            {field.helper && !isDisabled && (
              <span className="block text-xs text-gray-500 italic">
                {field.helper}
              </span>
            )}
          </div>
        )

      case "currency":
        return (
          <div className="space-y-1">
            <input
              type="number"
              name={field.name}
              value={field.value ? Math.trunc(field.value) : ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder={field.placeholder}
              disabled={isDisabled}
              required={field.required}
              className={baseInputClass}
              step="1"
            />
            <span className="block text-xs text-gray-500 italic">
              Format: Rp {formatRibuan(field.value || 0)}
            </span>
          </div>
        )

      case "percent":
        return (
          <div className="space-y-1">
            <input
              type="number"
              name={field.name}
              value={field.value || ""}
              onChange={(e) => {
                let val = Number(e.target.value)
                if (val > 100) val = 100
                if (val < 0) val = 0
                field.onChange(val)
              }}
              placeholder={field.placeholder}
              disabled={isDisabled}
              required={field.required}
              className={baseInputClass}
              min="0"
              max="100"
            />

            <span className="block text-xs text-gray-500 italic">
              Format: {field.value || 0}%
            </span>
          </div>
        )

      case "select":
        return (
          <select
            name={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            disabled={isDisabled}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">{field.placeholder || "Pilih opsi..."}</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case "date":
        return (
          <input
            type="date"
            name={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            disabled={isDisabled}
            required={field.required}
            className={baseInputClass}
          />
        )

      default:
        return null
    }
  }

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
        className="grid gap-x-3 gap-y-4 text-sm"
        style={{ gridTemplateColumns: `${labelWidth} 1fr` }}
      >
        {fields.map((field, index) => (
          <React.Fragment key={field.name || index}>
            <label
              htmlFor={field.name}
              className="flex items-center font-semibold"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <div>{renderInput(field)}</div>
          </React.Fragment>
        ))}
      </div>

      {/* Children (untuk button submit, dll) */}
      {children && <div className="pt-2">{children}</div>}
    </div>
  )
}

interface MatrixRow {
  rowLabel: string
  values: (string | number | React.ReactNode)[] // Langsung array nilai berurutan sesuai kolom
}

interface AppCardMatrixProps {
  title?: string
  icon?: React.ReactNode
  columns: string[] // Header kolom horizontal
  rows: MatrixRow[] // Data baris (vertikal) dan isinya
  labelWidth?: string // Lebar kolom label kiri (default 120px)
}

export function AppCardMatrix({
  title = "Data Matrix",
  icon,
  columns,
  rows,
  labelWidth = "120px",
}: AppCardMatrixProps) {
  return (
    <div className="w-full space-y-5 rounded-md border-2 border-gray-300 p-4">
      {/* Header Card */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-400 p-3 text-white shadow-sm">
          {icon ? icon : <Calendar size={20} />}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto pb-2">
        <div
          className="grid min-w-max items-center gap-x-4 gap-y-3 text-sm"
          style={{
            // Kolom pertama diatur labelWidth, sisanya dibagi rata sesuai jumlah kolom
            gridTemplateColumns: `${labelWidth} repeat(${columns.length}, minmax(100px, 1fr))`,
          }}
        >
          {/* Header Horizontal */}
          <div className="transparent"></div>
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="border-b pb-2 text-center font-bold text-gray-700 dark:text-gray-300"
            >
              {col}
            </div>
          ))}

          {/* Baris Vertikal & Nilainya */}
          {rows.map((row, rIdx) => (
            <React.Fragment key={rIdx}>
              {/* Label Kiri */}
              <div className="pr-2 font-semibold text-gray-800 dark:text-gray-200">
                {row.rowLabel}
              </div>

              {/* List Nilai Kolom */}
              {row.values.map((val, vIdx) => (
                <div
                  key={vIdx}
                  className="rounded-md border border-gray-100 bg-gray-50 p-2 text-center font-medium text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >
                  {val ?? "-"}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
