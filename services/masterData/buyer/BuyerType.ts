import { Meta } from "@/services/Meta"

export interface BuyerResponse {
  id: string
  name: string
  phone: string
  email: string
  address: string
  //   class: string\
  meta: Meta
}

export interface QueryParamBuyer {
  search?: string
  page: number
  limit: number
}

export interface PayloadCreateBuyer {
  name: string
  phone: string
  email: string
  address: string
  //   class: string
}
