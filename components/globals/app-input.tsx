import { formatRibuan } from "@/lib/utils"
import React from "react"

type TextProps = {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export const InputText = ({
  label,
  value,
  onChange,
  placeholder,
}: TextProps) => (
  <div className="space-y-1">
    <span className="text-sm font-semibold">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2"
      placeholder={placeholder}
    />
  </div>
)

type CurrencyProps = {
  label: string
  value: number
  onChange: (val: number) => void
  placeholder?: string
}

export const InputCurrency = ({
  label,
  value,
  onChange,
  placeholder,
}: CurrencyProps) => (
  <div className="space-y-1">
    <span className="text-sm font-semibold">{label}</span>
    <input
      type="number"
      // Math.trunc menghilangkan semua angka di belakang koma tanpa membulatkan
      value={value ? Math.trunc(value) : ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      placeholder={placeholder}
      step="1"
    />
    <span className="block text-[10px] text-gray-500 italic">
      Format: Rp {formatRibuan(value)}
    </span>
  </div>
)

type PercentProps = {
  label: string
  value: number
  onChange: (val: number) => void
  placeholder?: string
}

export const InputPercent = ({
  label,
  value,
  onChange,
  placeholder,
}: PercentProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (val > 100) val = 100
    if (val < 0) val = 0
    onChange(val)
  }

  return (
    <div className="space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type="number"
        value={value || ""}
        onChange={handleChange}
        className="w-full rounded-lg border-2 border-gray-300 px-3 py-2"
        placeholder={placeholder}
      />
      <span className="block text-[10px] text-gray-500 italic">
        Format: {value}%
      </span>
    </div>
  )
}

type NumberProps = {
  label: string
  value: number
  onChange: (val: number) => void
  placeholder?: string
  helper?: boolean
}

export const InputNumber = ({
  label,
  value,
  onChange,
  placeholder,
  helper = true,
}: NumberProps) => (
  <div className="space-y-1">
    <span className="text-sm font-semibold">{label}</span>
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      placeholder={placeholder}
    />
    {/* Helper untuk mempermudah baca angka besar */}
    {helper && (
      <span className="block text-[10px] text-gray-500 italic">
        Terbaca: {formatRibuan(value)}
      </span>
    )}
  </div>
)

type Option = {
  label: string
  value: string | number
}

type SelectProps = {
  label: string
  value: string | number
  onChange: (val: any) => void
  options: Option[]
  className?: string
}

export const InputSelect = ({
  label,
  value,
  onChange,
  options,
  className = "",
}: SelectProps) => (
  <div className={`space-y-1 ${className}`}>
    <span className="text-sm font-semibold">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none dark:bg-gray-800"
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)
