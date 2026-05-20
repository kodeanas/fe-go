import { Meta } from "@/services/Meta"

export interface PayloadCreateRakDisplay {
  name: string
}

export interface RakDisplayResponse {
  id: string
  code: string
  name: string
  meta: Meta
}

export interface QueryParamRakDisplay {
  search?: string
  page?: number
  limit?: number
}

export interface RakDisplaySummaryResponse {
  code: string
  name: string
  total_item: number
  total_price: number
  total_price_warehouse: number
}
