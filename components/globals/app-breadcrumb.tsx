"use client"

import { usePathname } from "next/navigation"
import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // Memecah path menjadi array dan membuang string kosong
  // Contoh: "/inventory/barang-masuk" -> ["inventory", "barang-masuk"]
  const paths = pathname.split("/").filter((path) => path !== "")

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Item pertama biasanya Home/Dashboard */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {paths.length > 0 && (
          <BreadcrumbSeparator className="hidden md:block" />
        )}

        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`
          const isLast = index === paths.length - 1

          // Format teks: hilangkan tanda hubung dan buat huruf kapital di awal
          const label = path
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="hidden md:block">
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
