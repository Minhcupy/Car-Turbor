"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Car, User, CreditCard } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "booking",
    user: "Alice Johnson",
    action: "booked",
    target: "BMW X5 2023",
    time: "2 minutes ago",
    icon: Car,
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "payment",
    user: "Bob Wilson",
    action: "completed payment for",
    target: "Booking #BK001",
    time: "5 minutes ago",
    icon: CreditCard,
    color: "text-green-500",
  },
  {
    id: 3,
    type: "registration",
    user: "Carol Davis",
    action: "registered as new customer",
    target: "",
    time: "12 minutes ago",
    icon: User,
    color: "text-purple-500",
  },
  {
    id: 4,
    type: "booking",
    user: "David Brown",
    action: "cancelled booking for",
    target: "Toyota Camry 2023",
    time: "18 minutes ago",
    icon: Car,
    color: "text-red-500",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                    {activity.target && <span className="font-medium">{activity.target}</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-3 h-3 ${activity.color}`} />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
