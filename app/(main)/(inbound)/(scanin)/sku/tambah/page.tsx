"use client"

import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadSku } from "@/services/inbound/scanIn/sku/SkuService"

export default function TambahSkuPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validasi file excel
      const validExtensions = ["xlsx", "xls"]
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

  // Handle remove file
  const handleRemoveFile = () => {
    setFile(null)
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert("Silakan pilih file terlebih dahulu")
      return
    }

    try {
      setLoading(true)

      const payload = {
        file: file,
        supplier: "Supplier Default", // Static supplier name
      }

      await uploadSku(payload)
      alert("File berhasil diupload!")
      router.push("/sku")
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
        <Link
          href="/sku"
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Upload File SKU</h1>
          <p className="text-sm text-gray-500">
            Upload file Excel untuk data SKU
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border-2 border-gray-300 bg-white p-8 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Upload File Excel</h2>
            <p className="text-sm text-gray-500">
              Pilih file Excel (.xlsx, .xls) yang berisi data SKU
            </p>
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col items-center justify-center">
            {!file ? (
              <label
                htmlFor="file-upload"
                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 transition-all hover:border-blue-400 hover:bg-blue-50 dark:bg-gray-700"
              >
                <Upload size={64} className="mb-4 text-gray-400" />
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Klik untuk upload file
                </p>
                <p className="text-sm text-gray-500">
                  atau drag and drop file Excel di sini
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Format: .xlsx, .xls
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="w-full rounded-xl border-2 border-green-400 bg-green-50 p-8 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-green-500 p-3">
                      <Upload size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-400">
                        {file.name}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Upload size={20} />
              {loading ? "Mengupload..." : "Upload File"}
            </button>
            <Link href="/sku">
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
          <li>Pastikan struktur file sesuai dengan template yang disediakan</li>
          <li>Maksimal ukuran file: 10 MB</li>
          <li>Hanya dapat mengupload 1 file dalam satu waktu</li>
        </ul>
      </div>
    </div>
  )
}
