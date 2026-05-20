import { Meta } from "../Meta"

export interface StickerResponse {
  id: string
  name: string
  type: string
  fixed_price: number
  status: "active" | "inactive"
  code_hex: string
  min_price: number
  max_price: number
  meta: Meta
}

export interface QueryParamsSticker {
  search?: string
  page?: number
  limit?: number
}

export interface PayloadCreateSticker {
  name: string
  type: string
  fixed_price: number
  status: "active" | "inactive"
  code_hex: string
  min_price: number
  max_price: number
}
