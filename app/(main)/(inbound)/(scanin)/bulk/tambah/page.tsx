"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileSpreadsheet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { uploadBulk } from "@/services/inbound/scanIn/bulk/BulkService"

export default function TambahBulkPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [typeProduct, setTypeProduct] = useState<"sticker" | "reguler">(
    "reguler"
  )
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validasi file excel
      const validExtensions = ["xlsx", "xls", "csv"]
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf(".") + 1)
        .toLowerCase()

      if (!validExtensions.includes(fileExtension)) {
        alert("File harus berformat Excel (.xlsx atau .xls)")
        e.target.value = ""
        return
      }

      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert("Silakan pilih file terlebih dahulu")
      return
    }

    try {
      setLoading(true)

      const fileExtension = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase()

      const payload = {
        file: file,
        type_product: typeProduct,
        type: fileExtension,
      }

      await uploadBulk(payload)
      alert("File berhasil diupload!")
      router.push("/bulk")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Gagal mengupload file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/bulk">
          <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Upload File Bulk</h1>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border-2 border-gray-300 bg-white p-6 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Upload File Excel <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            {file && (
              <p className="text-sm text-gray-600">
                File terpilih:{" "}
                <span className="font-semibold">{file.name}</span>
              </p>
            )}
            <span className="block text-xs text-gray-500 italic">
              Format file: .xlsx atau .xls
            </span>
          </div>

          {/* Tipe Produk Select */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Tipe Produk <span className="text-red-500">*</span>
            </label>
            <select
              value={typeProduct}
              onChange={(e) =>
                setTypeProduct(e.target.value as "sticker" | "reguler")
              }
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="reguler">Reguler</option>
              <option value="sticker">Sticker</option>
            </select>
            <span className="block text-xs text-gray-500 italic">
              Pilih tipe produk yang akan diupload
            </span>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Upload size={20} />
              {loading ? "Mengupload..." : "Upload File"}
            </button>
            <Link href="/bulk">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-100"
              >
                Batal
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:bg-blue-950">
        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
          ℹ️ Informasi Upload
        </h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>File harus dalam format Excel (.xlsx atau .xls)</li>
          <li>Pilih tipe produk sesuai dengan data yang akan diupload</li>
          <li>Pastikan struktur file sesuai dengan template yang disediakan</li>
          <li>Maksimal ukuran file: 10 MB</li>
        </ul>
      </div>
    </div>
  )
}
