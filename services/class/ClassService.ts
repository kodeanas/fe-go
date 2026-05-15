import api from "@/lib/api"
import { PayloadCreateClass, QueryParamsClass } from "./ClassType"

export const getClasses = async (params: QueryParamsClass) => {
  const res = await api.get("/classes", { params })
  return res.data
}

export const createClass = async (paylaod: PayloadCreateClass) => {
  const res = await api.post("/classes", paylaod)
  return res.data
}

export const upClass = async (id: string) => {
  const res = await api.put(`/classes/${id}/up`)
  return res.data
}

export const downClass = async (id: string) => {
  const res = await api.put(`/classes/${id}/down`)
  return res.data
}

export const updateClass = async (id: string, payload: PayloadCreateClass) => {
  const res = await api.put(`/classes/${id}`, payload)
  return res.data
}

export const deleteClass = async (id: string) => {
  const res = await api.delete(`/classes/${id}`)
  return res.data
}
