import { Suspense } from "react"

function BulkContent() {
  return (
    <div className="">
      <div className="">asd</div>
    </div>
  )
}

export default function BulkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BulkContent />
    </Suspense>
  )
}
