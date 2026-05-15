import api from "@/lib/api"
import { PayloadCreateSticker, QueryParamsSticker } from "./StickerType"

export const getStickers = async (params: QueryParamsSticker) => {
  const res = await api.get("/stickers", { params })
  return res.data
}

export const createSticker = async (data: PayloadCreateSticker) => {
  const res = await api.post("/stickers", data)
  return res.data
}

export const updateSticker = async (id: string, data: PayloadCreateSticker) => {
  const res = await api.put(`/stickers/${id}`, data)
  return res.data
}

export const deleteSticker = async (id: string) => {
  const res = await api.delete(`/stickers/${id}`)
  return res.data
}
