import { AppTable } from "@/components/globals/app-table"
import { RakDisplayResponse } from "@/services/inventory/display/DisplayType"
import { Meta } from "@/services/Meta"
import { Eye, FilePen } from "lucide-react"
import Link from "next/link"

type Props = {
  rackDisplays: RakDisplayResponse[]
  onSearch: (value: string) => void
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  meta?: Meta | null
  refreshData: () => void
}

export default function TableRakDisplay({
  rackDisplays,
  onSearch,
  page,
  limit,
  setPage,
  setLimit,
  meta,
  refreshData,
}: Props) {
  const columns = [
    {
      header: "Kode Rak Display",
      render: (item: RakDisplayResponse) => item.code,
    },
    {
      header: "Nama Rak Display",
      render: (item: RakDisplayResponse) => item.name,
    },
    {
      header: "Action",
      render: (item: RakDisplayResponse) => (
        <div className="flex gap-2">
          <Link
            href={`/rak-display/${item.id}`}
            className="flex items-center gap-1 rounded-lg text-blue-400 hover:cursor-pointer hover:text-blue-600"
          >
            <Eye size={25} />
          </Link>
        </div>
      ),
    },
  ]
  return (
    <div className="">
      <AppTable
        columns={columns}
        data={rackDisplays}
        onSearch={onSearch}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        meta={meta}
      />
    </div>
  )
}
