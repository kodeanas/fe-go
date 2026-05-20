import { Meta } from "@/services/Meta"

export interface PayloadCreateBast {
  file: File
  supplier: "Test Supplier Statis"
  header_barcode: string
  header_name: string
  header_item: string
  header_price: string
  type: string
}

export interface BastResponse {
  id: string
  code: string
  file_name: string
  file_item: number
  file_price: number
  status: string
  meta: Meta
}

export interface QueryParamBast {
  page: number
  limit: number
  search?: string
}

export interface bastResponseScan {
  barcode: string
  name: string
  item: number
  price: number
}

export interface PayloadBastScan {
  category_id?: string
  sticker_id?: string
  status: string
  note?: string
}

export interface BastScanResponse {
  barcode: string
  category_name?: string
  status: string
  name: string
  price: number
  price_warehouse: number
}

export interface DetailBastSummaryResponse {
  code: string
  file_name: string
  file_item: number
  file_price: number
  status: string
  good: {
    total_item: number
    total_price: number
    persentase: number
  }

  damaged: {
    total_item: number
    total_price: number
    persentase: string
  }
  abnormal: {
    total_item: number
    total_price: number
    persentase: number
  }
  non: {
    total_item: number
    total_price: number
    persentase: number
  }
  discrepancy: {
    total_item: number
    total_price: number
    persentase: number
  }
}

export interface DiscrepancyItemResponse {
  barcode: string
  name: string
  item: number
  price: number
  meta: Meta
}

export interface ScannedItemResponse {
  barcode: string
  name: string
  item: number
  price: number
  status: string
  meta: Meta
}

export interface QueryParamsProductBast {
  page: number
  limit: number
  search?: string
}

export interface SummaryAllBastResponse {
  total_document_inbound: number
  total_document_scanned: number
  total_product_good: number
  total_product_damaged: number
  total_product_abnormal: number
  total_product_non: number
}
