import api from "@/lib/api"
import { PayloadCreateBuyer, QueryParamBuyer } from "./BuyerType"

export const getBuyers = async (params: QueryParamBuyer) => {
  const res = await api.get("/buyers", { params })
  return res.data
}

export const createBuyer = async (payload: PayloadCreateBuyer) => {
  const res = await api.post("/buyers", payload)
  return res.data
}

export const updateBuyer = async (id: string, payload: PayloadCreateBuyer) => {
  const res = await api.put(`/buyers/${id}`, payload)
  return res.data
}

export const deleteBuyer = async (id: string) => {
  const res = await api.delete(`/buyers/${id}`)
  return res.data
}

export const getBuyerById = async (id: string) => {
  const res = await api.get(`/buyers/${id}`)
  return res.data
}
