import { Meta } from "../Meta"

export interface PpnResponse {
  id: string
  tax: number
  is_active: boolean
  meta: Meta
}

export interface QueryParamsPpn {
  search?: string
  page?: number
  limit?: number
}

export interface PayloadCreatePpn {
  tax: number
  is_active: boolean
}
