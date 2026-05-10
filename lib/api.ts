import axios from "axios"

// Ambil base URL dari env
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"

// Buat instance axios
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// OPTIONAL: intercept response (biar error lebih rapi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bisa custom error handling di sini
    return Promise.reject(error)
  }
)

export default api
