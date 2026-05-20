import { Suspense } from "react"

function DetailSkuContent() {
  return (
    <div className="">
      <p>Detail SKU</p>
    </div>
  )
}

export default function DetailSkuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailSkuContent />
    </Suspense>
  )
}
