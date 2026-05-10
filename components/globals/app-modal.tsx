import React from "react"

type ModalProps = {
  children?: React.ReactNode
  onClose?: () => void
  title?: string
}

export function AppModal({ children, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="flex max-h-screen w-full max-w-xl flex-col rounded-lg bg-white p-5 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title ?? "Modal Title"}</h2>

          <button
            onClick={onClose}
            className="text-red-500 hover:cursor-pointer hover:text-red-800"
          >
            X
          </button>
        </div>

        <div className="mt-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
