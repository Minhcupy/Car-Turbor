"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Navigation,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    title: "Cars",
    href: "/admin/cars",
    icon: Car,
    subItems: [
      { title: "Car List", href: "/admin/cars" },
      { title: "Brands", href: "/admin/cars/brands" },
      { title: "CarTypes", href: "/admin/cars/cartypes" },
      { title: "Details", href: "/admin/cars/details" },
    ],
  },
  { title: "Fleet Management", href: "/admin/fleet", icon: Navigation },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Bookings", href: "/admin/bookings", icon: Calendar },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Cars"])
  const pathname = usePathname()

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title],
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">CarRental</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            const isExpanded = expandedItems.includes(item.title)
            const hasSubItems = item.subItems && item.subItems.length > 0

            return (
              <div key={item.title}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "flex items-center w-full px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors",
                      isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </Button>
                )}

                {/* Sub-items */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <Button
                        asChild
                        key={subItem.href}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          pathname === subItem.href &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                        )}
                      >
                        <Link href={subItem.href}>{subItem.title}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
