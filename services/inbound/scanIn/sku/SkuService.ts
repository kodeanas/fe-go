import api from "@/lib/api"
import { PayloadSku, QueryParamSku } from "./SkuType"

export const uploadSku = async (payload: PayloadSku) => {
  const formData = new FormData()
  formData.append("file", payload.file)
  formData.append("supplier", payload.supplier)
  const res = await api.post("/inbound-sku/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export const getSkuList = async (params?: QueryParamSku) => {
  const res = await api.get("/product-documents/sku", { params })
  return res.data
}
