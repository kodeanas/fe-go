import api from "@/lib/api"
import { PayloadCreateCategory, QueryParamsCategory } from "./CategoryType"

export const getCategories = async (params: QueryParamsCategory) => {
  const res = await api.get("/categories", { params })
  return res.data
}

export const createCategory = async (data: PayloadCreateCategory) => {
  const res = await api.post("/categories", data)
  return res.data
}

export const editCategory = async (id: string, data: PayloadCreateCategory) => {
  const res = await api.put(`/categories/${id}`, data)
  return res.data
}

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`)
  return res.data
}
