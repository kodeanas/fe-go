import { Meta } from "../Meta"

export interface CategoryResponse {
  id: string
  name: string
  min_price: number
  max_price: number
  status: "active" | "inactive"
  discount: number
  meta: Meta
}

export interface QueryParamsCategory {
  page?: number
  limit?: number
  search?: string
}

export interface PayloadCreateCategory {
  name: string
  max_price: number
  status: "active" | "inactive"
  discount: number
}

export interface PayloadEditCategory {
  name: string
  max_price: number
  status: "active" | "inactive"
  discount: number
}
