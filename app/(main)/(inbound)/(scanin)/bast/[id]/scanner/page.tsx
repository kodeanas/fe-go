"use client"

import {
  AppCardInput,
  AppCardSmall,
  AppCardSummary,
} from "@/components/globals/app-card"
import { Button } from "@/components/ui/button"
import { Boxes, Package, SaveAll, Tag } from "lucide-react"
import { Suspense, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  getBastScan,
  postBastScan,
} from "@/services/inbound/scanIn/bast/BastService"
import {
  bastResponseScan,
  BastScanResponse,
} from "@/services/inbound/scanIn/bast/BastType"
import { getStickers } from "@/services/sticker/StickerService"
import { getCategories } from "@/services/category/CategoryService"
import { StickerResponse } from "@/services/sticker/StickerType"
import { CategoryResponse } from "@/services/category/CategoryType"
import { formatRibuan } from "@/lib/utils"
import { AppBarcodeReguler } from "@/components/globals/app-barcode"

function ScannerContent() {
  const params = useParams()
  const id = params.id as string

  // State untuk barcode input
  const [barcode, setBarcode] = useState("")
  const [scannedData, setScannedData] = useState<bastResponseScan | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // State untuk status dan note
  const [status, setStatus] = useState<"good" | "damaged" | "abnormal" | "non">(
    "good"
  )
  const [note, setNote] = useState("")

  // State untuk sticker dan category
  const [stickers, setStickers] = useState<StickerResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [selectedSticker, setSelectedSticker] =
    useState<StickerResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // State untuk barcode response
  const [submitResponse, setSubmitResponse] = useState<BastScanResponse | null>(
    null
  )
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)

  // Fetch Stickers
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const data = await getStickers({ page: 1, limit: 100 })
        setStickers(data.data || [])
      } catch (error) {
        console.error("Error fetching stickers:", error)
      }
    }
    fetchStickers()
  }, [])

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories({ page: 1, limit: 100 })
        setCategories(data.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Auto-scan ketika barcode berubah
  useEffect(() => {
    if (barcode.trim() === "") {
      setScannedData(null)
      setSelectedSticker(null)
      setSelectedCategory(null)
      setStatus("good")
      setNote("")
      return
    }

    const fetchScanData = async () => {
      try {
        setLoading(true)
        const data = await getBastScan(id, barcode)
        console.log("Scanned data:", data) // Debug log
        setScannedData(data)
      } catch (error) {
        console.error("Error fetching scan data:", error)
        alert("Barcode tidak ditemukan")
        setScannedData(null)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchScanData()
    }, 500) // Delay 500ms untuk auto-scan

    return () => clearTimeout(timeoutId)
  }, [barcode, id])

  // Auto-select sticker atau category berdasarkan harga - only for status "good"
  useEffect(() => {
    if (!scannedData) return

    if (status === "good") {
      if (scannedData.price < 100000 && scannedData.price > 0) {
        const matchedSticker = stickers.find(
          (sticker) =>
            scannedData.price >= sticker.min_price &&
            scannedData.price <= sticker.max_price
        )
        setSelectedSticker(matchedSticker || null)
        setSelectedCategory(null)
      } else if (scannedData.price >= 100000) {
        setSelectedSticker(null)
        // Category tidak auto-select, user harus pilih manual
      }
    } else {
      // Reset sticker and category for non-good status
      setSelectedSticker(null)
      setSelectedCategory(null)
    }
  }, [scannedData, stickers, status])

  // Get selected category data
  const getSelectedCategoryData = () => {
    return categories.find((cat) => cat.id === selectedCategory)
  }

  // Calculate warehouse price
  const calculateWarehousePrice = () => {
    if (!scannedData) return 0

    // Jika status bukan "good", warehouse price = 0
    if (status !== "good") return 0

    if (scannedData.price < 100000) {
      return selectedSticker?.fixed_price || 0
    } else if (scannedData.price >= 100000) {
      const categoryData = getSelectedCategoryData()
      if (!categoryData) return 0
      return scannedData.price * (1 - categoryData.discount / 100)
    }
    return 0
  }

  // Handler submit
  const handleSubmit = async () => {
    if (!scannedData) {
      alert("Tidak ada data yang di-scan")
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        status,
        note: status !== "good" ? note : undefined,
        category_id:
          status === "good" && scannedData.price >= 100000
            ? selectedCategory || undefined
            : undefined,
        sticker_id:
          status === "good" && scannedData.price < 100000
            ? selectedSticker?.id
            : undefined,
      }

      const response = await postBastScan(id, barcode, payload)
      console.log("Submit response:", response)
      console.log("Full response structure:", JSON.stringify(response, null, 2))

      // Tampilkan barcode hanya untuk produk dengan kategori (category_name tidak null)
      if (response.category_name) {
        setSubmitResponse(response)
        setShowBarcodeModal(true)
      } else {
        alert("Data berhasil disimpan!")
      }

      // Reset form
      setBarcode("")
      setScannedData(null)
      setSelectedSticker(null)
      setSelectedCategory(null)
      setStatus("good")
      setNote("")
    } catch (error) {
      console.error("Error submitting scan:", error)
      alert("Gagal menyimpan data")
    } finally {
      setSubmitting(false)
    }
  }

  // Handler close barcode modal
  const handleCloseBarcodeModal = () => {
    setShowBarcodeModal(false)
    setSubmitResponse(null)
  }

  return (
    <div className="space-y-5">
      <AppCardSmall
        code="kode-001"
        nameFile="Nama File"
        totalItem="10/20"
        totalPrice="Rp 500.000 / Rp 1.000.000"
      ></AppCardSmall>

      {/* Scanner Input Section */}
      <div className="rounded-lg border-2 border-gray-300 bg-white p-5 dark:bg-gray-800">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Scanner Barcode</h2>
          <hr className="border-gray-200" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan atau ketik barcode..."
            className="w-full rounded-md border border-gray-300 p-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {loading && (
            <span className="text-xs text-blue-500 italic">
              Memproses scan...
            </span>
          )}
          {scannedData && (
            <span className="text-xs font-semibold text-green-500 italic">
              ✓ Data ditemukan!
            </span>
          )}
        </div>
      </div>

      {/* Data Cards - hanya tampil jika ada scannedData */}
      {scannedData && (
        <>
          <div className="grid grid-cols-2 gap-5">
            <AppCardInput
              title="Data Asal"
              icon={<SaveAll size={20} className="text-white" />}
              labelWidth="250px"
              fields={[
                {
                  name: "barcodeAsal",
                  label: "Barcode asal",
                  type: "text",
                  value: scannedData.barcode,
                  onChange: () => {},
                  placeholder: "Masukkan barcode...",
                  required: true,
                  disabled: true,
                },
                {
                  name: "namaBarangAsal",
                  label: "Nama barang asal",
                  type: "text",
                  value: scannedData.name,
                  onChange: () => {},
                  placeholder: "Masukkan nama barang...",
                  required: true,
                  disabled: true,
                },
                {
                  name: "jumlahAsal",
                  label: "Jumlah asal",
                  type: "number",
                  value: scannedData.item,
                  onChange: () => {},
                  placeholder: "0",
                  disabled: true,
                },
                {
                  name: "hargaAsal",
                  label: "Harga asal",
                  type: "currency",
                  value: scannedData.price,
                  onChange: () => {},
                  placeholder: "0",
                  disabled: true,
                },
              ]}
            />
            <AppCardInput
              title="Data Warehouse"
              icon={<SaveAll size={20} className="text-white" />}
              labelWidth="250px"
              fields={[
                {
                  name: "namaBarangWarehouse",
                  label: "Nama barang warehouse",
                  type: "text",
                  value: scannedData.name,
                  onChange: () => {},
                  placeholder: "Masukkan nama barang...",
                  required: true,
                  disabled: true,
                },
                {
                  name: "jumlahWarehouse",
                  label: "Jumlah warehouse",
                  type: "number",
                  value: scannedData.item,
                  onChange: () => {},
                  placeholder: "0",
                  disabled: true,
                },
                {
                  name: "hargaWarehouse",
                  label: "Harga warehouse",
                  type: "currency",
                  value: calculateWarehousePrice(),
                  onChange: () => {},
                  placeholder: "0",
                  disabled: true,
                },
              ]}
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-6 rounded-lg border-2 border-gray-300 bg-white p-5 dark:bg-gray-800">
            <div className="space-y-4">
              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Status Barang</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: "good", label: "Good", color: "green" },
                    { value: "damaged", label: "Damaged", color: "red" },
                    { value: "abnormal", label: "Abnormal", color: "yellow" },
                    { value: "non", label: "Non", color: "gray" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                        status === item.value
                          ? item.color === "green"
                            ? "border-green-400 bg-green-50 ring-1 ring-green-400"
                            : item.color === "red"
                              ? "border-red-400 bg-red-50 ring-1 ring-red-400"
                              : item.color === "yellow"
                                ? "border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400"
                                : "border-gray-400 bg-gray-50 ring-1 ring-gray-400"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status_selection"
                        value={item.value}
                        checked={status === item.value}
                        onChange={(e) =>
                          setStatus(
                            e.target.value as
                              | "good"
                              | "damaged"
                              | "abnormal"
                              | "non"
                          )
                        }
                        className="sr-only"
                      />
                      <span
                        className={`text-sm font-bold ${
                          status === item.value
                            ? item.color === "green"
                              ? "text-green-600"
                              : item.color === "red"
                                ? "text-red-600"
                                : item.color === "yellow"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                      {status === item.value && (
                        <div
                          className={`absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${
                            item.color === "green"
                              ? "bg-green-400"
                              : item.color === "red"
                                ? "bg-red-400"
                                : item.color === "yellow"
                                  ? "bg-yellow-400"
                                  : "bg-gray-400"
                          } text-white`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Note - Only show if status is not "good" */}
              {status !== "good" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tuliskan catatan untuk barang yang rusak/abnormal..."
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticker Card - tampil jika harga < 100k */}
          {status === "good" &&
            scannedData.price > 0 &&
            scannedData.price < 100000 && (
              <div className="rounded-lg border-2 border-gray-300 bg-white p-6 dark:bg-gray-800">
                {selectedSticker ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div
                        className="rounded-lg p-3"
                        style={{ backgroundColor: selectedSticker.code_hex }}
                      >
                        <Tag size={20} className="text-white" />
                      </div>
                      <div className="">
                        <h1 className="font-bold">{selectedSticker.name}</h1>
                        <hr />
                        <p className="text-sm">Tipe: {selectedSticker.type}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <h1 className="font-bold">Fixed Price</h1>
                      <hr />
                      <p>Rp {formatRibuan(selectedSticker.fixed_price)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Tidak ada sticker yang cocok untuk harga ini</p>
                    <p className="text-sm">
                      (Range: Rp {formatRibuan(scannedData.price)})
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* Category Section - tampil jika harga >= 100k */}
          {status === "good" && scannedData.price >= 100000 && (
            <div className="space-y-5">
              {/* Category Info Card */}
              {selectedCategory && getSelectedCategoryData() && (
                <div className="rounded-lg border-2 border-gray-300 bg-white p-6 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="rounded-lg bg-blue-400 p-3">
                        <Boxes size={20} className="text-white" />
                      </div>
                      <div className="">
                        <h1 className="font-bold">
                          Kategori {getSelectedCategoryData()?.name}
                        </h1>
                        <hr />
                        <p className="text-sm">
                          Diskon: {getSelectedCategoryData()?.discount}%
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <h1 className="font-bold">Warehouse Price</h1>
                      <hr />
                      <p>Rp {formatRibuan(calculateWarehousePrice())}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Selection */}
              <div className="space-y-3 rounded-lg border-2 border-gray-300 bg-white p-6 dark:bg-gray-800">
                <h1 className="text-xl font-bold">Pilih Kategori</h1>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((item) => (
                      <label
                        key={item.id}
                        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                          selectedCategory === item.id
                            ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category_selection"
                          value={item.id}
                          checked={selectedCategory === item.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="sr-only"
                        />

                        <span
                          className={`text-sm font-bold ${selectedCategory === item.id ? "text-blue-600" : "text-gray-700"}`}
                        >
                          {item.name}
                        </span>

                        <div
                          className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${selectedCategory === item.id ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-500"}`}
                        >
                          Diskon {item.discount}%
                        </div>

                        {selectedCategory === item.id && (
                          <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-400 text-white shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    <p>Loading categories...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                !scannedData ||
                (status === "good" &&
                  scannedData.price >= 100000 &&
                  !selectedCategory) ||
                (status !== "good" && !note)
              }
              className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {submitting ? "Menyimpan..." : "Simpan Data Scan"}
            </button>
          </div>
        </>
      )}

      {/* Barcode Modal - tampil setelah submit berhasil */}
      {showBarcodeModal && submitResponse && (
        <AppBarcodeReguler
          barcodeText={submitResponse.barcode}
          productName={submitResponse.name}
          price={submitResponse.price}
          priceWarehouse={submitResponse.price_warehouse}
          categoryName={submitResponse.category_name || ""}
          categoryDiscount={0} // Dummy dulu, nanti dari BE
          onClose={handleCloseBarcodeModal}
          onPrint={() => window.print()}
        />
      )}
    </div>
  )
}

export default function Scanner() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScannerContent />
    </Suspense>
  )
}
