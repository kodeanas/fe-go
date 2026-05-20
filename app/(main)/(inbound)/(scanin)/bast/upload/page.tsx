"use client"

import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import * as XLSX from "xlsx"
import { BastType } from "@/services/inbound/scanIn/bast/BastService"
import { useRouter } from "next/navigation"

function UploadExcelContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Mapping states
  const [selectedBarcode, setSelectedBarcode] = useState<string>("")
  const [selectedName, setSelectedName] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [selectedPrice, setSelectedPrice] = useState<string>("")

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
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

  // Read Excel headers
  const readExcelHeaders = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "binary" })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          const headers = (jsonData[0] as string[]) || []
          resolve(headers)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsBinaryString(file)
    })
  }

  // Handle next to step 2
  const handleNext = async () => {
    if (!file) return

    try {
      setLoading(true)
      const extractedHeaders = await readExcelHeaders(file)
      setHeaders(extractedHeaders)
      setStep(2)
    } catch (error) {
      console.error("Error reading Excel file:", error)
      alert("Gagal membaca file Excel. Pastikan file valid.")
    } finally {
      setLoading(false)
    }
  }

  // Handle submit
  const handleSubmit = async () => {
    if (
      !file ||
      !selectedBarcode ||
      !selectedName ||
      !selectedItem ||
      !selectedPrice
    ) {
      alert("Mohon pilih semua mapping header")
      return
    }

    try {
      setLoading(true)

      const fileExtension = file.name.split(".").pop() || "xlsx"

      const payload = {
        file: file,
        supplier: "Test Supplier Statis" as const,
        header_barcode: selectedBarcode,
        header_name: selectedName,
        header_item: selectedItem,
        header_price: selectedPrice,
        type: fileExtension,
      }

      await BastType(payload)
      alert("Data berhasil diupload!")
      router.push("/bast")
    } catch (error) {
      console.error("Error uploading:", error)
      alert("Gagal mengupload data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/bast"
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Upload Excel BAST</h1>
          <p className="text-sm text-gray-500">
            Step {step} of 2 - {step === 1 ? "Upload File" : "Mapping Header"}
          </p>
        </div>
      </div>

      {/* Step 1: Upload File */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="rounded-lg border-2 border-gray-300 bg-white p-8 dark:bg-gray-800">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">Upload File Excel</h2>
                <p className="text-sm text-gray-500">
                  Pilih file Excel (.xlsx, .xls) yang berisi data BAST
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
                        onClick={handleRemoveFile}
                        className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end gap-3">
                <Link
                  href="/bast"
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition-all hover:bg-gray-100"
                >
                  Batal
                </Link>
                <button
                  onClick={handleNext}
                  disabled={!file || loading}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? "Memproses..." : "Lanjut"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Mapping Headers */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-lg border-2 border-gray-300 bg-white p-8 dark:bg-gray-800">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">Mapping Header Excel</h2>
                <p className="text-sm text-gray-500">
                  Pilih kolom mana yang sesuai dengan data yang dibutuhkan
                </p>
              </div>

              {/* File Info */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm">
                  <span className="font-semibold">File:</span> {file?.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Headers ditemukan:</span>{" "}
                  {headers.length} kolom
                </p>
              </div>

              {/* Mapping Form */}
              <div className="grid grid-cols-4 gap-4">
                {/* Barcode Mapping */}
                <div className="space-y-3">
                  <label className="text-sm font-bold">1. Barcode</label>
                  <div className="flex flex-col gap-2">
                    {headers.map((header, index) => (
                      <label
                        key={`barcode-${index}`}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          selectedBarcode === header
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="barcode"
                          value={header}
                          checked={selectedBarcode === header}
                          onChange={(e) => setSelectedBarcode(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`text-sm font-semibold ${
                            selectedBarcode === header
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {header}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name Mapping */}
                <div className="space-y-3">
                  <label className="text-sm font-bold">2. Nama</label>
                  <div className="flex flex-col gap-2">
                    {headers.map((header, index) => (
                      <label
                        key={`name-${index}`}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          selectedName === header
                            ? "border-green-500 bg-green-50 ring-2 ring-green-400"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="name"
                          value={header}
                          checked={selectedName === header}
                          onChange={(e) => setSelectedName(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`text-sm font-semibold ${
                            selectedName === header
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {header}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Item/Qty Mapping */}
                <div className="space-y-3">
                  <label className="text-sm font-bold">3. Qty/Item</label>
                  <div className="flex flex-col gap-2">
                    {headers.map((header, index) => (
                      <label
                        key={`item-${index}`}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          selectedItem === header
                            ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="item"
                          value={header}
                          checked={selectedItem === header}
                          onChange={(e) => setSelectedItem(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`text-sm font-semibold ${
                            selectedItem === header
                              ? "text-yellow-600"
                              : "text-gray-700"
                          }`}
                        >
                          {header}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Mapping */}
                <div className="space-y-3">
                  <label className="text-sm font-bold">4. Harga</label>
                  <div className="flex flex-col gap-2">
                    {headers.map((header, index) => (
                      <label
                        key={`price-${index}`}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          selectedPrice === header
                            ? "border-purple-500 bg-purple-50 ring-2 ring-purple-400"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="price"
                          value={header}
                          checked={selectedPrice === header}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`text-sm font-semibold ${
                            selectedPrice === header
                              ? "text-purple-600"
                              : "text-gray-700"
                          }`}
                        >
                          {header}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition-all hover:bg-gray-100"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !selectedBarcode ||
                    !selectedName ||
                    !selectedItem ||
                    !selectedPrice ||
                    loading
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? "Mengupload..." : "Upload Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UploadExcelPage() {
  return <UploadExcelContent />
}
