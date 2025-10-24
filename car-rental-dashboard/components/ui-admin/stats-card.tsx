import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  delta?: {
    value: number
    isPositive: boolean
  }
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, delta, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <p className={cn("text-xs mt-1", delta.isPositive ? "text-green-600" : "text-red-600")}>
            {delta.isPositive ? "+" : ""}
            {delta.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
