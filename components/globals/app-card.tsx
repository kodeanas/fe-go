import { User } from "lucide-react"
import React from "react"

type CardProps = {
  title?: string
  number?: number
  icon?: React.ReactNode
}

export function AppCard({ title, number, icon }: CardProps) {
  return (
    <div className="h-auto w-full space-y-2 rounded-md border-2 border-gray-300 p-4">
      <h2 className="text-lg font-semibold">{title ?? "Total User"}</h2>
      <div className="flex items-center gap-5">
        <div className="rounded-full bg-blue-500 p-2">{icon ?? ""}</div>
        <p className="text-2xl font-bold">{number ?? 0}</p>
      </div>
    </div>
  )
}
