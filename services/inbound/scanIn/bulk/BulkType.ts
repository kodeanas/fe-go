import { Meta } from "@/services/Meta"

export interface PayloadBulk {
  file: File
  type_product: "sticker" | "reguler"
  //   Type ini untuk menyimpan ekstension file
  type: string
}

export interface BulkResponse {
  id: string
  code: string
  file_name: string
  file_item: number
  file_price: number
  meta: Meta
}

export interface QUeryParamBulk {
  page: number
  limit: number
  search?: string
}

export interface GetSummaryBulkResponse {
  total_document_upload: number
  total_product_masuk: number
  total_harga_masuk: number
}

export interface GetDetailSummaryBulkResponse {
  label: string
  item: number
  price: number
  price_warehouse: number
}
