import { DynamicBreadcrumb } from "@/components/globals/app-breadcrumb"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PhoneCall,
} from "lucide-react"
import Link from "next/link"

const menus = [
  {
    group: "Dashboard",
    items: [
      { title: "Gudang", href: "/gudang", subItems: [] },
      { title: "Penjualan", href: "/penjualan", subItems: [] },
    ],
  },
  {
    group: "Master Data",
    items: [
      { title: "Buyer", href: "/buyer", subItems: [] },
      { title: "Supplier", href: "/supplier", subItems: [] },
    ],
  },
  {
    group: "Inbound",
    items: [
      {
        title: "ScanIn",
        href: "#",
        subItems: [
          { title: "Bast", href: "/bast" },
          { title: "Bulk", href: "/inbound/scanin/bulk" },
          { title: "SKU", href: "/inbound/scanin/sku" },
          { title: "Satuan", href: "/satuan" },
        ],
      },
      { title: "Return BKL", href: "/inbound/return-bkl", subItems: [] },
    ],
  },
  {
    group: "Staging",
    items: [
      {
        title: "Staging Reguler",
        href: "#",
        subItems: [
          { title: "Bag", href: "/staging/reguler/bag" },
          { title: "Produk", href: "/staging/reguler/produk" },
        ],
      },
      {
        title: "Staging Sticker",
        href: "#",
        subItems: [
          { title: "Bag", href: "/staging/sticker/bag" },
          { title: "Produk", href: "/staging/sticker/produk" },
        ],
      },
      { title: "Staging SKU", href: "/staging/sku", subItems: [] },
    ],
  },
  {
    group: "Inventory",
    items: [
      {
        title: "Display",
        href: "#",
        subItems: [
          { title: "Rak", href: "/inventory/display/rak" },
          { title: "Produk", href: "/inventory/display/produk" },
        ],
      },
      {
        title: "BKL",
        href: "#",
        subItems: [
          { title: "Bag", href: "/inventory/bkl/bag" },
          { title: "Produk", href: "/inventory/bkl/produk" },
        ],
      },
      { title: "Repair", href: "/inventory/repair", subItems: [] },
      {
        title: "Cargo",
        href: "#",
        subItems: [
          { title: "Bag", href: "/inventory/cargo/bag" },
          { title: "Cargo", href: "/inventory/cargo/detail" },
        ],
      },
    ],
  },
  {
    group: "Non Inventory",
    items: [
      {
        title: "Produk",
        href: "#",
        subItems: [
          { title: "Abnormal", href: "/non-inventory/produk/abnormal" },
          { title: "Damaged", href: "/non-inventory/produk/damaged" },
          { title: "Non", href: "/non-inventory/produk/non" },
        ],
      },
      {
        title: "Disposall",
        href: "#",
        subItems: [
          { title: "Scrap", href: "/non-inventory/disposall/scrap" },
          { title: "QCD", href: "/non-inventory/disposall/qcd" },
        ],
      },
    ],
  },
  {
    group: "Outbound",
    items: [
      {
        title: "Penjualan Reguler",
        href: "/outbound/penjualan-reguler",
        subItems: [],
      },
      {
        title: "Wholesale",
        href: "#",
        subItems: [
          { title: "Cargo", href: "/outbound/wholesale/cargo" },
          { title: "Scrap", href: "/outbound/wholesale/scrap" },
          { title: "QCD", href: "/outbound/wholesale/qcd" },
        ],
      },
      { title: "Transfer Toko", href: "/outbound/transfer-toko", subItems: [] },
    ],
  },
  {
    group: "Admin Panel",
    items: [
      {
        title: "User",
        href: "#",
        subItems: [
          { title: "User WMS", href: "/user-wms" },
          { title: "User Toko", href: "/admin/user/toko" },
        ],
      },
      { title: "PPN", href: "/ppn", subItems: [] },
      { title: "Kelas Buyer", href: "/kelas-buyer", subItems: [] },
      {
        title: "Potongan Harga",
        href: "#",
        subItems: [
          { title: "Kategori", href: "/kategori" },
          { title: "Sticker", href: "/sticker" },
        ],
      },
    ],
  },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar className="">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-3">
            <div className="rounded-lg bg-blue-500 p-2 text-white dark:bg-blue-800">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold">Manajemen Gudang</h1>
          </div>
          <hr />
        </SidebarHeader>
        <SidebarContent>
          {menus.map((menu) => (
            <SidebarGroup key={menu.group}>
              <SidebarGroupLabel>
                <div className="flex w-full items-center gap-3 text-lg whitespace-nowrap">
                  <span>{menu.group}</span>
                  <hr className="flex-1 border-t border-gray-300" />
                </div>
              </SidebarGroupLabel>
              <SidebarMenu>
                {menu.items.map((item) => {
                  if (item.subItems.length > 0) {
                    return (
                      <Collapsible
                        asChild
                        key={item.title}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="hover:cursor-pointer">
                              {/* Nama Menu */}
                              <span>{item.title}</span>

                              {/* Ikon Chevron dengan animasi rotasi */}
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.href}>
                                      {subItem.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  } else {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="hover:cursor-pointer"
                        >
                          <Link href={item.href}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="p-4">
          <hr className="mb-4 opacity-50" />
          <a
            href="https://wa.me/628123456789" // Ganti dengan nomor WA admin
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 p-3 transition-all hover:bg-green-100 hover:shadow-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm transition-transform group-hover:scale-110">
              <MessageCircle size={10} fill="currentColor" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-green-800 dark:text-green-400">
                Ada Kendala?
              </p>
              <p className="truncate text-[10px] font-bold text-green-900 dark:text-green-300">
                Hubungi Tim IT WA
              </p>
            </div>
          </a>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* HEADER START */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2">
            {/* Trigger Sidebar */}
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <DynamicBreadcrumb />

            {/* Bagian Kanan Header (Bisa taruh Nama User / Profile) */}
            <div className="ml-auto flex items-center gap-2">
              <div className="mr-2 hidden text-sm font-medium sm:block">
                Admin WMS
              </div>
              <div className="p-2">
                <LogOut className="h-4 w-4 text-red-400 hover:cursor-pointer hover:text-red-600" />
              </div>
            </div>
          </div>
        </header>
        {/* HEADER END */}

        {/* CONTENT AREA */}
        <main className="p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
