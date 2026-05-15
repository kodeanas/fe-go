import { Suspense } from "react"

function PpnContent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">PPN Content</h1>
    </div>
  )
}

export default function PpnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PpnContent />
    </Suspense>
  )
}
