import { Suspense } from "react"

function BastContent() {
  return (
    <div className="">
      <div className="">test</div>
    </div>
  )
}

export default function BastPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BastContent />
    </Suspense>
  )
}
