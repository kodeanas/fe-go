"use client" // Penting: useEffect & useState butuh client component

import { AppCardInfoDetail } from "@/components/globals/app-card"
import { getBuyerById } from "@/services/masterData/buyer/BuyerService"
import { User } from "lucide-react"
import { useParams } from "next/navigation"
import React, { Suspense, useEffect, useState } from "react"

function DetailBuyerPage() {
  const { id } = useParams() // Mengambil ID dari URL (misal: /buyer/123)
  const [buyer, setBuyer] = useState<any>(null) // State untuk simpan data API
  const [loading, setLoading] = useState(true)

  // Fungsi untuk ambil data
  const fetchDetail = async () => {
    try {
      const res = await getBuyerById(id as string)
      setBuyer(res.data) // Simpan hasil API ke state buyer
    } catch (error) {
      console.error("Gagal ambil data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDetail()
  }, [id])

  // Mapping data dari state buyer ke format yang dibutuhkan AppCardInfoDetail
  const dataBuyer = [
    { label: "Nama Buyer", value: buyer?.name || "-" },
    { label: "Kontak", value: buyer?.phone || "-" },
    { label: "Email", value: buyer?.email || "-" },
    { label: "Alamat", value: buyer?.address || "-" },
  ]

  return (
    <div className="grid w-full grid-cols-3 items-start gap-5">
      <div className="col-span-1">
        <AppCardInfoDetail
          title="Detail Buyer"
          icon={<User size={25} />}
          data={dataBuyer}
        />
      </div>
      <div className="col-span-1 h-auto rounded-lg border-2 border-gray-300 p-3 xl:col-span-2">
        <h3 className="mb-3 border-b pb-2 font-bold">Informasi Tambahan</h3>
        Coming Soon
      </div>
    </div>
  )
}

export default function DetailBuyer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailBuyerPage />
    </Suspense>
  )
}
