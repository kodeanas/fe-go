export interface PayloadEditUser {
  name: string
  email: string
  phone: string
  role: string
  status: boolean
}
import api from "@/lib/api"
import { Meta } from "../Meta"

export interface PayloadCreateUser {
  name: string
  email: string
  password: string
  phone: string
  role: string
  status: boolean
}

export interface TotalUserResponse {
  total_user: number
}

export interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: boolean
  meta: Meta
}

export interface QueryParamsUser {
  search?: string
  limit?: number
  page?: number
}
