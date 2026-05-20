import api from "@/lib/api"
import { PayloadBulk, QUeryParamBulk } from "./BulkType"

export const uploadBulk = async (payload: PayloadBulk) => {
  const formData = new FormData()
  formData.append("file", payload.file)
  formData.append("type_product", payload.type_product)
  formData.append("type", payload.type)

  const res = await api.post("/inbound/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export const getBulkList = async (params: QUeryParamBulk) => {
  const res = await api.get("/product-documents/bulk", { params })
  return res.data
}

export const getSummaryBulk = async () => {
  const res = await api.get("/inbound/bulk-summary-all")
  return res.data
}

export const getDetailSummaryBulk = async (id: string) => {
  const res = await api.get(`/inbound/bulk/document/${id}/summary`)
  return res.data
}
