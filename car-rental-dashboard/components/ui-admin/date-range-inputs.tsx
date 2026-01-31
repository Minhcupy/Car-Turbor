"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SimpleDateRange = {
    from?: string // YYYY-MM-DD
    to?: string   // YYYY-MM-DD
}

type Props = {
    value: SimpleDateRange
    onChange: (next: SimpleDateRange) => void
    className?: string
}

export function DateRangeInputs({ value, onChange, className }: Props) {
    return (
        <div className={cn("grid grid-cols-2 gap-3", className)}>
            <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Start</div>
                <input
                    type="date"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    value={value.from ?? ""}
                    onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
                />
            </div>

            <div className="space-y-1">
                <div className="text-xs text-muted-foreground">End</div>
                <input
                    type="date"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    value={value.to ?? ""}
                    min={value.from ?? undefined}
                    onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
                />
            </div>
        </div>
    )
}
