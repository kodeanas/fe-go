import { Meta } from "../Meta"

export interface ClassResponse {
  id: string
  name: string
  disc: number
  status: "active" | "inactive"
  min_order: number
  min_transaction_value: number
  week: number
  iteration: number
  meta: Meta
}

export interface QueryParamsClass {
  search?: string
  page?: number
  limit?: number
}

export interface PayloadCreateClass {
  name: string
  disc: number
  min_order: number
  min_transaction_value: number
  week: number
  status: "active" | "inactive"
}
