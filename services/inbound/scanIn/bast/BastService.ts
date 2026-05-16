import api from "@/lib/api"
import {
  PayloadBastScan,
  PayloadCreateBast,
  QueryParamBast,
  QueryParamsProductBast,
} from "./BastType"

export const BastType = async (payload: PayloadCreateBast) => {
  const formData = new FormData()
  formData.append("file", payload.file)
  formData.append("supplier", payload.supplier)
  formData.append("header_barcode", payload.header_barcode)
  formData.append("header_name", payload.header_name)
  formData.append("header_item", payload.header_item)
  formData.append("header_price", payload.header_price)
  formData.append("type", payload.type)

  const res = await api.post("/inbound/bast-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export const getBastList = async (params: QueryParamBast) => {
  const res = await api.get("/product-documents/bast", { params })
  return res.data
}

export const getBastScan = async (id: string, barcode: string) => {
  const res = await api.get(`/inbound/bast-scanner/${id}/product/${barcode}`)
  return res.data.data
}

export const postBastScan = async (
  id: string,
  barcode: string,
  payload: PayloadBastScan
) => {
  const res = await api.post(
    `/inbound/bast-scanner/${id}/scan/${barcode}`,
    payload
  )
  return res.data.data
}

export const getBastSummary = async (id: string) => {
  const res = await api.get(`/inbound/document/${id}/summary`)
  return res.data
}

export const getBastProductDiscrepancy = async (
  id: string,
  params: QueryParamsProductBast
) => {
  const res = await api.get(`/inbound/document/${id}/products-discrepancy`, {
    params,
  })
  return res.data
}

export const getBastProductScanned = async (
  id: string,
  params: QueryParamsProductBast
) => {
  const res = await api.get(`/inbound/document/${id}/products-scanned`, {
    params,
  })
  return res.data
}

export const finishBast = async (id: string) => {
  const res = await api.post(`/inbound/bast-scanner/${id}/finish`)
  return res.data
}
