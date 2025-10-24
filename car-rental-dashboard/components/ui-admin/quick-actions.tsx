"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Car, Users, Calendar, TrendingUp } from "lucide-react"

const quickActions = [
  {
    title: "Add New Car",
    description: "Register a new vehicle",
    icon: Car,
    color: "bg-blue-500 hover:bg-blue-600",
    href: "/admin/cars",
  },
  {
    title: "New Booking",
    description: "Create manual booking",
    icon: Calendar,
    color: "bg-green-500 hover:bg-green-600",
    href: "/admin/bookings",
  },
  {
    title: "Add Customer",
    description: "Register new customer",
    icon: Users,
    color: "bg-purple-500 hover:bg-purple-600",
    href: "/admin/customers",
  },
  {
    title: "Generate Report",
    description: "Create business report",
    icon: TrendingUp,
    color: "bg-orange-500 hover:bg-orange-600",
    href: "/admin/reports",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all bg-transparent"
                asChild
              >
                <a href={action.href}>
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
