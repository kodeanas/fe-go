"use client"

import { AppCard } from "@/components/globals/app-card"
import { Tag } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import TableSticker from "./table"
import { StickerResponse } from "@/services/sticker/StickerType"
import { Meta } from "@/services/Meta"
import { createSticker, getStickers } from "@/services/sticker/StickerService"
import { useRouter, useSearchParams } from "next/navigation"
import { AppModal } from "@/components/globals/app-modal"
import { formatRibuan } from "@/lib/utils"

function StickerContent() {
  // Get data stiker
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stickers, setStickers] = React.useState<StickerResponse[]>([])
  const [meta, setMeta] = React.useState<Meta | null>(null)
  const [search, setSearch] = React.useState("")
  // Ambil dari query params jika ada
  const initialSearch = searchParams.get("name") || ""
  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const initialLimit = parseInt(searchParams.get("limit") || "5", 10)
  const [page, setPage] = React.useState(initialPage)
  const [limit, setLimit] = React.useState(initialLimit)
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    if (page) params.set("page", String(page))
    if (limit) params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [search, page, limit, router])
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  const fetchData = async () => {
    try {
      const data = await getStickers({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setStickers(data.data)
      setMeta(data.meta)
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchData()
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    params.set("page", String(page))
    params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [debouncedSearch, page, limit])

  //   Modal Create
  const [createModal, setCreateModal] = React.useState(false)
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("")
  const [fixedPrice, setFixedPrice] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")
  const [codeHex, setCodeHex] = React.useState("")
  const [minPrice, setMinPrice] = React.useState(0)
  const [maxPrice, setMaxPrice] = React.useState(0)
  const handleCreateOpen = () => {
    setName("")
    setType("small") // Langsung set ke small
    setFixedPrice(12000) // Langsung set harga small
    setStatus("active")
    setCodeHex("#000000") // Beri default warna agar tidak error/kosong
    setMinPrice(0)
    setMaxPrice(0)
    setCreateModal(true)
  }
  const handleCreateClose = () => {
    setCreateModal(false)
    setName("")
    setType("")
    setFixedPrice(0)
    setStatus("active")
    setCodeHex("")
    setMinPrice(0)
    setMaxPrice(0)
  }

  //   Create Data
  const handleCreate = async (e: any) => {
    try {
      const data = await createSticker({
        name,
        type,
        fixed_price: fixedPrice,
        status,
        code_hex: codeHex,
        min_price: minPrice,
        max_price: maxPrice,
      })
      //   fetchData()
      alert("Berhasil menambahkan stiker")
      handleCreateClose()
    } catch (error) {
      alert("Gagal menambahkan stiker")
      console.error(error)
    }
  }

  useEffect(() => {
    if (type === "big") {
      setFixedPrice(24000)
    } else if (type === "small") {
      setFixedPrice(12000)
    } else if (type === "tiny") {
      setFixedPrice(0)
    }
  }, [type]) // useEffect ini akan jalan setiap kali nilai 'type' berubah

  return (
    <div className="grid gap-3 xl:grid-cols-3">
      <div className="col-span-1 space-y-3">
        <AppCard
          icon={<Tag className="m-auto h-6 w-6 font-bold text-white" />}
          number={meta?.pagination.total_items || 0}
          title="Total Kategori"
        />
        <div className="w-full rounded-lg border-2 border-gray-300 px-4 py-3">
          <button
            onClick={handleCreateOpen}
            className="w-full rounded-lg bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
      <div className="col-span-1 rounded-lg border-2 border-gray-300 p-3 xl:col-span-2">
        <TableSticker
          refreshData={fetchData}
          stickers={stickers}
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
        />
      </div>

      {/* Create Modal */}
      {createModal && (
        <AppModal title="Tambah Sticker" onClose={handleCreateClose}>
          <form
            action=""
            className="grid grid-cols-2 gap-3"
            onSubmit={handleCreate}
          >
            <div className="space-y-1">
              <span className="font-semibold">Nama</span>
              <input
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Nama ..."
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Status</span>
              <select
                name="status"
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "inactive")
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Max Price</span>
              <input
                name="maxPrice"
                type="number"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Max Price ..."
              />
              {/* Helper */}
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(maxPrice)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Min Price</span>
              <input
                name="minPrice"
                type="number"
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Min Price ..."
              />
              {/* Helper */}
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(minPrice)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Tipe</span>
              <select
                name="type"
                onChange={(e) =>
                  setType(e.target.value as "small" | "big" | "tiny")
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="small">Small</option>
                <option value="big">Big</option>
                <option value="tiny">Tiny</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Fixed Price</span>
              <input
                name="fixedPrice"
                type="number"
                // Tambahkan value di bawah ini agar input sinkron dengan state
                value={fixedPrice}
                onChange={(e) => setFixedPrice(Number(e.target.value))}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Fixed Price ..."
              />
              <span className="text-[10px] text-gray-500 italic">
                Format: Rp {formatRibuan(fixedPrice)}
              </span>
            </div>
            {/* Input Hex Color */}
            <div className="col-span-2 space-y-1">
              <span className="font-semibold">Warna Sticker (Hex)</span>
              <div className="flex items-center gap-3">
                {/* Preview & Color Picker */}
                <input
                  type="color"
                  value={codeHex || "#000000"}
                  onChange={(e) => setCodeHex(e.target.value)}
                  className="w-10 border-2 border-gray-300 p-0 hover:cursor-pointer"
                />

                {/* Text Input */}
                <input
                  name="code_hex"
                  type="text"
                  value={codeHex}
                  onChange={(e) => setCodeHex(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-3 uppercase"
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateClose}
                  className="rounded-lg border-2 px-3 py-1 hover:cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700"
                >
                  Tambah
                </button>
              </div>
            </div>
          </form>
        </AppModal>
      )}
    </div>
  )
}

export default function StickerPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading Halaman...</div>}
    >
      <StickerContent />
    </Suspense>
  )
}
