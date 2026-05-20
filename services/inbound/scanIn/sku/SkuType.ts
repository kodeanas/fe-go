import { Meta } from "@/services/Meta"

export interface PayloadSku {
  file: File
  supplier: string
}

export interface SkuResponse {
  id: string
  code: string
  file_name: string
  file_item: number
  file_price: number
  status: string
  meta: Meta
}

export interface QueryParamSku {
  search?: string
  page?: number
  limit?: number
}
