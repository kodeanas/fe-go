import { Meta } from "@/services/Meta"

export interface SatuanResponse {
  id: string
  barcode: string
  name: string
  item: number
  price: number
  price_warehouse: number
  status: "good" | "damaged" | "abnormal" | "non"
  note?: string
  category_name?: string
  sticker_name?: string
  meta: Meta
}

export interface PayloadCreateSatuan {
  name: string
  item: number
  price: number
  status: "good" | "damaged" | "abnormal" | "non"
  note?: string
  category_id?: string
  sticker_id?: string
}

export interface QueryParamSatuan {
  page: number
  limit: number
  search?: string
}
