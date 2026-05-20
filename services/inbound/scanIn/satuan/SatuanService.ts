import api from "@/lib/api"
import { PayloadCreateSatuan, QueryParamSatuan } from "./SatuanType"

export const getSatuan = async (params: QueryParamSatuan) => {
  const res = await api.get("/inbound/manual-pending", { params })
  return res.data
}

export const createSatuan = async (payload: PayloadCreateSatuan) => {
  const res = await api.post("/inbound/manual", payload)
  return res.data
}
