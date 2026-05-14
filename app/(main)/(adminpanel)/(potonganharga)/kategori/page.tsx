"use client"

import { AppCard } from "@/components/globals/app-card"
import { AppModal } from "@/components/globals/app-modal"
import { User } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import TableKategori from "./table"
import {
  createCategory,
  getCategories,
} from "@/services/category/CategoryService"
import { CategoryResponse } from "@/services/category/CategoryType"
import { Meta } from "@/services/Meta"
import { useRouter, useSearchParams } from "next/navigation"
import { formatRibuan } from "@/lib/utils"

function KategoriContent() {
  // Modal Create
  const [openCreate, setOpenCreate] = React.useState(false)
  const [name, setName] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [status, setStatus] = React.useState<"active" | "inactive">("active")
  const [maxPrice, setMaxPrice] = React.useState(0)

  const handleOpenCreate = () => {
    setName("")
    setDiscount(0)
    setStatus("active")
    setMaxPrice(0)
    setOpenCreate(true)
  }

  const handleCreate = async (e: any) => {
    // e.preventDefault()
    try {
      const data = await createCategory({
        name,
        discount,
        status,
        max_price: maxPrice,
      })
      setOpenCreate(false)
      setName("")
      setDiscount(0)
      setStatus("active")
      setMaxPrice(0)
      alert("Berhasil menambahkan kategori")
    } catch (error) {
      alert("Gagal menambahkan kategori")
      setOpenCreate(false)
      setName("")
      setDiscount(0)
      setStatus("active")
      setMaxPrice(0)
    }
  }

  const handleCloseCreate = () => {
    setOpenCreate(false)
    setName("")
    setDiscount(0)
    setStatus("active")
    setMaxPrice(0)
  }

  // Data
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = React.useState<CategoryResponse[]>([])
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
      const data = await getCategories({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setCategories(data.data)
      setMeta(data.meta)
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
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="col-span-1 space-y-3">
        <AppCard
          icon={<User className="m-auto h-6 w-6 font-bold text-white" />}
          number={meta?.pagination.total_items}
          title="Total Kategori"
        />
        <div className="w-full rounded-lg border-2 border-gray-300 px-4 py-3">
          <button
            onClick={handleOpenCreate}
            className="w-full rounded-lg bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
      <div className="col-span-2 rounded-lg border-2 border-gray-300 p-3">
        <TableKategori
          refreshData={fetchData}
          categories={categories}
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
      {/* Modal Create */}
      {openCreate && (
        <AppModal title="Tambah Kategori" onClose={handleCloseCreate}>
          {/* Form Create Kategori */}
          <form
            action=""
            className="grid grid-cols-2 gap-3"
            onSubmit={handleCreate}
            method="POST"
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
              <span className="font-semibold">Discount</span>
              <input
                name="discount"
                type="number"
                onChange={(e) => {
                  let value = Number(e.target.value)

                  if (value > 100) value = 100 // Maksimal 100
                  if (value < 0) value = 0 // Minimal 0 (mencegah angka minus)

                  setDiscount(value)
                }}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Discount ..."
              />
              <span className="text-[10px] text-gray-500 italic">
                Format: {discount}%
              </span>
            </div>

            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseCreate}
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

// Export utama dengan Suspense
export default function KategoriPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading Halaman...</div>}
    >
      <KategoriContent />
    </Suspense>
  )
}
