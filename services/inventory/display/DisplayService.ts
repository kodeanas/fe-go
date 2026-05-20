import api from "@/lib/api"
import { PayloadCreateRakDisplay, QueryParamRakDisplay } from "./DisplayType"

export const CreateRakDisplay = async (payload: PayloadCreateRakDisplay) => {
  const res = await api.post("/rack-displays", payload)
  return res.data
}

export const getRakDisplays = async (params: QueryParamRakDisplay) => {
  const res = await api.get("/rack-displays", { params })
  return res.data
}

export const getRakDisplaySummary = async (id: string) => {
  const res = await api.get(`/rack-displays/${id}/detail`)
  return res.data
}
