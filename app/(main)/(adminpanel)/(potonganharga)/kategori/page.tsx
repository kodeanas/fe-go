import { AppCard } from "@/components/globals/app-card"
import { User } from "lucide-react"

export default function KategoriPage() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="col-span-1 space-y-3">
        <AppCard
          icon={<User className="m-auto h-6 w-6 font-bold text-white" />}
          number={100}
          title="Total User WMS"
        />
      </div>
    </div>
  )
}
