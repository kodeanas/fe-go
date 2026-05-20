"use client"

import {
  AppCardInfoDetail,
  AppCardSummary,
} from "@/components/globals/app-card"
import { FilePen, Plus } from "lucide-react"
import React, { Suspense } from "react"
import TableBagStagingReguler from "./table"
import { createBagStagingReguler } from "@/services/inventory/staging/stagingReguler/StagingRegulerService"
import { AppModal } from "@/components/globals/app-modal"
import { InputSelect } from "@/components/globals/app-input"
import { RakDisplayResponse } from "@/services/inventory/display/DisplayType"
import { getRakDisplays } from "@/services/inventory/display/DisplayService"

function BagStagingReguler() {
  // Modal Create
  const [modalCreateBag, setModalCreateBag] = React.useState(false)
  const [idRackDisplay, setIdRackDisplay] = React.useState("")
  const handleOpenModal = () => {
    setIdRackDisplay("")
    setModalCreateBag(true)
  }
  const handleCloseModal = () => {
    setIdRackDisplay("")
    setModalCreateBag(false)
  }
  const handleSubmitBag = async (e: any) => {
    e.preventDefault()
    try {
      const data = await createBagStagingReguler({
        rack_display_id: idRackDisplay,
      })
      console.log(data)
      handleCloseModal()
    } catch (error) {
      console.error(error)
      handleCloseModal()
    }
  }

  //   Select Rak Display
  const [rackDisplays, setRackDisplays] = React.useState<RakDisplayResponse[]>(
    []
  )
  const fetchRackDisplays = async () => {
    try {
      const data = await getRakDisplays({})
      setRackDisplays(data.data)
    } catch (error) {
      console.error(error)
    }
  }
  React.useEffect(() => {
    fetchRackDisplays()
  }, [])
  console.log(rackDisplays)
  return (
    <div className="space-y-5">
      <AppCardSummary
        title="Total Bag Staging Hari Ini"
        data={[
          {
            label: "Total Bag",
            value: "100 Bag",
          },
          {
            label: "Total Item",
            value: "20000 Item",
          },
          {
            label: "Total Harga",
            value: "Rp 200.000.000",
          },
        ]}
      />
      <div className="flex w-full justify-end">
        <button
          className="flex gap-2 rounded-lg bg-blue-400 px-4 py-3 text-white hover:cursor-pointer hover:bg-blue-500"
          onClick={handleOpenModal}
        >
          <Plus size={20} className="text-white" />
          Buat Bag
        </button>
      </div>
      <div className="rounded-lg border-2 border-gray-300 p-4">
        <TableBagStagingReguler />
      </div>
      {modalCreateBag && (
        <AppModal title="Buat Bag Staging" onClose={handleCloseModal}>
          <div className="space-y-5">
            <div className="text-center">
              <div className="flex w-full justify-center">
                <div className="rounded-full bg-blue-400 p-3">
                  <FilePen size={24} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold">Buat Bag Staging</h2>
              <p className="text-sm text-gray-500">
                Masukkan nama bag staging yang ingin dibuat.
              </p>
              {/* KALIMAT PERINGATAN */}
              <p className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-600">
                <strong>Perhatian:</strong> Semua barang yang ada di bag staging
                ini, ketika diklik kirim akan langsung masuk ke rak display yang
                sudah dipilih sebelumnya.
              </p>
            </div>
            <form
              action=""
              method="post"
              className="space-y-5"
              onSubmit={handleSubmitBag}
            >
              <InputSelect
                label="Rak Display"
                value={
                  rackDisplays.find((rack) => rack.id === idRackDisplay)?.id ||
                  ""
                }
                options={rackDisplays.map((rack) => ({
                  label: rack.name,
                  value: rack.id,
                }))}
                onChange={(value) => setIdRackDisplay(value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-400 px-5 py-2 font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-100"
                >
                  {" "}
                  Kembali
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-400 px-5 py-2 font-semibold text-white hover:cursor-pointer hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </AppModal>
      )}
    </div>
  )
}

export default function BagStagingRegulerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BagStagingReguler />
    </Suspense>
  )
}
