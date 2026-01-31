"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  className?: string
  value?: DateRange
  onChange?: (v: DateRange | undefined) => void
}

export function DatePickerWithRange({ className, value, onChange }: Props) {
  const [internal, setInternal] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })

  const date = value ?? internal

  const setDate = (v: DateRange | undefined) => {
    setInternal(v)
    onChange?.(v)
  }

  const label = date?.from
      ? date.to
          ? `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
          : format(date.from, "dd/MM/yyyy")
      : "Pick a date range"

  return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
                type="button"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date?.from && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-auto p-0 z-[9999]">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
  )
}
