import { clsx, type ClassValue } from "clsx"
import JsBarcode from "jsbarcode"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatRibuan = (number: number): string => {
  return new Intl.NumberFormat("id-ID").format(number)
}

export function generateBarcodeBase64(text: string): string {
  // Kita pakai canvas virtual di memori (tidak merender ke DOM)
  const canvas = document.createElement("canvas")

  JsBarcode(canvas, text, {
    format: "CODE128",
    displayValue: false, // Kita matikan text bawaannya karena custom layout di bawah gambar
    margin: 0,
    background: "#ffffff",
    lineColor: "#000000",
  })

  return canvas.toDataURL("image/png")
}
