import api from "@/lib/api"
import { PayloadCreatePpn, QueryParamsPpn } from "./PpnType"

export const getPpn = async (params: QueryParamsPpn) => {
  const res = await api.get("/taxes", { params })
  return res.data
}

export const createPpn = async (data: PayloadCreatePpn) => {
  const res = await api.post("/taxes", data)
  return res.data
}

export const updatePpn = async (id: string, data: PayloadCreatePpn) => {
  const res = await api.put(`/taxes/${id}`, data)
  return res.data
}

export const deletePpn = async (id: string) => {
  const res = await api.delete(`/taxes/${id}`)
  return res.data
}
