"use client"

import { formatRibuan } from "@/lib/utils"
import { Boxes, Tag } from "lucide-react"
import React, { useState, useEffect } from "react"
import { getStickers } from "@/services/sticker/StickerService"
import { getCategories } from "@/services/category/CategoryService"
import { createSatuan } from "@/services/inbound/scanIn/satuan/SatuanService"
import { StickerResponse } from "@/services/sticker/StickerType"
import { CategoryResponse } from "@/services/category/CategoryType"

function TambahSatuanContent() {
  // Form States
  const [barcode, setBarcode] = React.useState("")
  const [name, setName] = React.useState("")
  const [qty, setQty] = React.useState(0)
  const [price, setPrice] = React.useState(0)
  const [status, setStatus] = React.useState<
    "good" | "damaged" | "abnormal" | "non"
  >("good")
  const [note, setNote] = React.useState("")

  // Data States
  const [stickers, setStickers] = React.useState<StickerResponse[]>([])
  const [categories, setCategories] = React.useState<CategoryResponse[]>([])
  const [selectedSticker, setSelectedSticker] =
    React.useState<StickerResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  )
  const [loading, setLoading] = React.useState(false)

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

  // Auto-select sticker based on price (< 100k) - only for status "good"
  useEffect(() => {
    if (status === "good") {
      if (price < 100000 && price > 0) {
        const matchedSticker = stickers.find(
          (sticker) => price >= sticker.min_price && price <= sticker.max_price
        )
        setSelectedSticker(matchedSticker || null)
        setSelectedCategory(null) // Reset category when price < 100k
      } else if (price >= 100000) {
        setSelectedSticker(null) // Reset sticker when price >= 100k
      }
    } else {
      // Reset sticker and category for non-good status
      setSelectedSticker(null)
      setSelectedCategory(null)
    }
  }, [price, stickers, status])

  // Get selected category data
  const getSelectedCategoryData = () => {
    return categories.find((cat) => cat.id === selectedCategory)
  }

  // Calculate warehouse price
  const calculateWarehousePrice = () => {
    const categoryData = getSelectedCategoryData()
    if (!categoryData) return price
    return price * (1 - categoryData.discount / 100)
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload = {
        name,
        item: qty,
        price,
        status,
        note: status !== "good" ? note : undefined,
        category_id:
          status === "good" && price >= 100000
            ? selectedCategory || undefined
            : undefined,
        sticker_id:
          status === "good" && price < 100000 ? selectedSticker?.id : undefined,
      }

      await createSatuan(payload)
      alert("Satuan berhasil ditambahkan!")

      // Reset form
      setBarcode("")
      setName("")
      setQty(0)
      setPrice(0)
      setStatus("good")
      setNote("")
      setSelectedCategory(null)
      setSelectedSticker(null)
    } catch (error) {
      console.error("Error creating satuan:", error)
      alert("Gagal menambahkan satuan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-6 rounded-lg border-2 border-gray-300 bg-white p-5 dark:bg-gray-800">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Tambah Satuan</h1>
          <hr className="border-gray-200" />
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* Barcode Asal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Barcode Asal</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan atau ketik barcode..."
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500 italic">
              *Kosongkan jika produk tidak memiliki barcode dari supplier.
            </span>
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Nama Satuan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dus, Pack, atau Karton"
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row Qty & Harga */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Qty</label>
              <input
                type="number"
                value={qty || ""}
                onChange={(e) => setQty(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Harga Asal</label>
              <div className="relative">
                <span className="absolute top-2.5 left-3 text-sm text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-md border border-gray-300 py-2.5 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-gray-400 italic">
                Format: Rp {formatRibuan(price)}
              </span>
            </div>
          </div>

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
      {status === "good" && price > 0 && price < 100000 ? (
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
              <p className="text-sm">(Range: Rp {formatRibuan(price)})</p>
            </div>
          )}
        </div>
      ) : status === "good" && price >= 100000 ? (
        <div className="space-y-5">
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

          {/* Category */}
          <div className="space-y-3 rounded-lg border-2 border-gray-300 bg-white p-6 dark:bg-gray-800">
            <h1 className="text-xl font-bold"> Pilih Kategori</h1>
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
                    {/* Input Hidden - Biar fungsionalitas radio tetep jalan tapi gak ganggu UI */}
                    <input
                      type="radio"
                      name="category_selection"
                      value={item.id}
                      checked={selectedCategory === item.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="sr-only" // Screen reader only (sembunyiin buletan aslinya)
                    />

                    {/* Isi Card */}
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

                    {/* Indikator Checklist (Opsional - Muncul pas kepilih) */}
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
      ) : null}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={
            loading || !name || !qty || !price || (status !== "good" && !note)
          }
          className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan Satuan"}
        </button>
      </div>
    </div>
  )
}

export default function TambahSatuanPage() {
  return (
    <div className="">
      <TambahSatuanContent />
    </div>
  )
}
