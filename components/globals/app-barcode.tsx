import { generateBarcodeBase64 } from "@/lib/utils"
import { useMemo } from "react"

// Interface untuk tipe data props
interface AppBarcodeRegulerProps {
  barcodeText: string
  productName: string
  price: number
  priceWarehouse: number
  categoryName: string
  categoryDiscount: number // Cukup masukkan angka, misal: 40
  onClose?: () => void
  onPrint?: () => void
}

export function AppBarcodeReguler({
  barcodeText,
  productName,
  price,
  priceWarehouse,
  categoryName,
  categoryDiscount,
  onClose,
  onPrint,
}: AppBarcodeRegulerProps) {
  // Generate gambar barcode langsung dari props barcodeText
  const barcodeSrc = useMemo(() => {
    if (!barcodeText) return ""
    try {
      return generateBarcodeBase64(barcodeText)
    } catch (error) {
      console.error("Gagal generate barcode:", error)
      return ""
    }
  }, [barcodeText])

  // Helper untuk format rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-slate-900/60 p-4">
      <div className="flex items-center justify-center rounded-xl bg-white px-8 pt-6 pb-8">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Barcode Reguler</h2>
            <button
              onClick={onClose}
              className="font-bold text-red-500 hover:cursor-pointer hover:text-red-800"
            >
              X
            </button>
          </div>

          <div className="box-border flex aspect-[7/4] w-[420px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 text-black select-none">
            {/* BARIS ATAS: Barcode & Kategori Label */}
            <div className="flex w-full items-start justify-between gap-4">
              {/* Sisi Kiri: Barcode Area */}
              <div className="flex min-w-0 flex-1 flex-col items-center tracking-tight">
                {barcodeSrc ? (
                  <img
                    src={barcodeSrc}
                    alt="Barcode"
                    className="h-16 w-full object-fill"
                  />
                ) : (
                  <div className="flex h-16 w-full items-center justify-center bg-slate-100 text-[10px] text-slate-400">
                    Gagal memuat barcode
                  </div>
                )}

                {/* Teks kode di bawah barcode */}
                <span className="mt-1 font-mono text-[10px] font-medium tracking-[0.15em] text-slate-800">
                  {barcodeText}
                </span>
              </div>

              {/* Sisi Kanan: Kategori Box */}
              <div className="w-[130px] shrink-0 rounded-sm border border-neutral-900 bg-neutral-50 px-2 py-2 text-center font-sans">
                <p className="text-[10px] leading-tight font-bold tracking-wider text-neutral-800 uppercase">
                  {categoryName}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-neutral-500">
                  (&gt;700) ({categoryDiscount}%)
                </p>
              </div>
            </div>

            {/* BARIS BAWAH: Informasi Produk & Detail Harga */}
            <div className="w-full space-y-2">
              {/* Nama Produk */}
              <h3 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
                {productName}
              </h3>

              {/* Grid Harga */}
              <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 font-sans">
                {/* Harga Retail */}
                <span className="text-sm font-medium tracking-wide text-slate-500">
                  Harga Asal
                </span>
                <div className="flex items-center text-sm font-semibold text-slate-400">
                  <span className="mr-1">:</span>
                  <span className="line-through decoration-slate-400 decoration-1">
                    {formatRupiah(price)}
                  </span>
                </div>

                {/* Harga Diskon */}
                <span className="text-base font-bold tracking-wide text-neutral-800">
                  Harga Gudang
                </span>
                <div className="flex items-center text-xl font-extrabold text-neutral-900">
                  <span className="mr-1 text-base font-bold">:</span>
                  <span>{formatRupiah(priceWarehouse)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onPrint}
            className="w-full rounded-lg bg-blue-400 py-2 text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}
