"use client"

import { AppCard } from "@/components/globals/app-card"
import { AppModal } from "@/components/globals/app-modal"
import { createUser, getUsers } from "@/services/user/UserService"
import { Meta } from "@/services/Meta"
import React, { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TableUser } from "./table"
import { UserResponse } from "@/services/user/UserType"
import { User } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

function UserWmsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Modal create
  const [openCreate, setOpenCreate] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState("users")
  const [status, setStatus] = React.useState(true || false)

  function openCreateModal() {
    setOpenCreate(true)
  }
  function closeCreate() {
    setName("")
    setEmail("")
    setPhone("")
    setPassword("")
    setRole("")
    setStatus(false)
    setOpenCreate(false)
  }

  const handleCreate = async (e: any) => {
    // e.preventDefault()

    try {
      const data = await createUser({
        name,
        email,
        phone,
        password,
        role,
        status,
      })
      setName("")
      setEmail("")
      setPhone("")
      setPassword("")
      setRole("")
      setStatus(false)
      setOpenCreate(false)
      alert("Berhasil menambahkan user WMS")
    } catch (error) {
      alert("Gagal menambahkan user WMS")
    }
  }

  // Get User Table
  const [users, setUsers] = React.useState<UserResponse[]>([])
  const [meta, setMeta] = React.useState<Meta | null>(null)
  // Ambil dari query params jika ada
  const initialSearch = searchParams.get("name") || ""
  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const initialLimit = parseInt(searchParams.get("limit") || "5", 10)
  const [search, setSearch] = React.useState(initialSearch)
  const [page, setPage] = React.useState(initialPage)
  const [limit, setLimit] = React.useState(initialLimit)
  // Update URL query params setiap kali search, page, atau limit berubah
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    if (page) params.set("page", String(page))
    if (limit) params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [search, page, limit, router])
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)
  const fetchData = async () => {
    try {
      const data = await getUsers({
        search: debouncedSearch || undefined,
        page,
        limit,
      })
      setUsers(data.data)
      setMeta(data.meta)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchData()
    const params = new URLSearchParams()
    if (search) params.set("name", search)
    params.set("page", String(page))
    params.set("limit", String(limit))
    router.replace(`?${params.toString()}`)
  }, [debouncedSearch, page, limit])

  // Total User

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="col-span-1 space-y-3">
        <AppCard
          icon={<User className="m-auto h-6 w-6 font-bold text-white" />}
          number={meta?.pagination.total_items}
          title="Total User WMS"
        />
        <div className="w-full rounded-lg border-2 border-gray-300 px-4 py-3">
          <button
            onClick={openCreateModal}
            className="w-full rounded-lg bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
      <div className="col-span-2 rounded-lg border-2 border-gray-300 p-3">
        <TableUser
          refreshData={fetchData}
          users={users}
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          meta={meta}
        />
      </div>

      {/* Modal create */}
      {openCreate && (
        <AppModal title="Tambah User WMS" onClose={closeCreate}>
          <form
            method="post"
            onSubmit={handleCreate}
            className="grid grid-cols-2 gap-3"
          >
            <div className="space-y-1">
              <span className="font-semibold">Nama</span>
              <input
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Nama ..."
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Email</span>
              <input
                name="email"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Email ..."
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Phone</span>
              <input
                name="phone"
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Phone ..."
              />
            </div>
            <div className="space-y-1">
              <span className="font-semibold">Role</span>
              <select
                name="role"
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option>-- Pilih Role --</option>
                <option value="users">Users</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="font-semibold">Status</span>
              <select
                name="status"
                onChange={(e) =>
                  setStatus(e.target.value === "true" ? true : false)
                }
                className="w-full rounded-lg border-2 border-gray-300 px-3"
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="font-semibold">Password</span>
              <input
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-3"
                placeholder="Masukkan Password ..."
              />
            </div>
            <div className="col-span-2 flex w-full justify-end">
              <div className="flex items-center gap-3">
                <button className="rounded-lg border-2 px-3 py-1 hover:cursor-pointer">
                  Batal
                </button>
                <button className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:cursor-pointer hover:bg-blue-700">
                  Tambah
                </button>
              </div>
            </div>
          </form>
        </AppModal>
      )}
    </div>
  )
}

export default function UserWmsPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading Halaman...</div>}
    >
      <UserWmsContent />
    </Suspense>
  )
}
