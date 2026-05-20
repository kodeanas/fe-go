import api from "@/lib/api"
import {
  PayloadBagStagingReguler,
  QueryParamBagStagingReguler,
} from "./StagingRegulerType"

export const getBagStagingReguler = async (
  param: QueryParamBagStagingReguler
) => {
  const res = await api.get("/rack-stagings", { params: param })
  return res.data
}

export const createBagStagingReguler = async (
  payload: PayloadBagStagingReguler
) => {
  const res = await api.post("/rack-stagings", payload)
  return res.data
}
