import { Suspense } from "react"

function BuyerContent() {
  return (
    <div className="">
      <div className="">asd</div>
    </div>
  )
}

export default function BuyerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyerContent />
    </Suspense>
  )
}
