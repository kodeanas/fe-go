import api from "@/lib/api"
import { PayloadCreateUser, PayloadEditUser, QueryParamsUser } from "./UserType"

export const getUsers = async (params: QueryParamsUser) => {
  const res = await api.get("/users", { params })
  return res.data
}

export const editUser = async (id: string, data: PayloadEditUser) => {
  const res = await api.put(`/users/${id}`, data)
  return res.data
}

export const createUser = async (data: PayloadCreateUser) => {
  const res = await api.post("/users", data)
  return res.data
}

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/users/${id}`)

  return res.data
}
