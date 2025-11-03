"use client"

import * as React from "react"
import { parseDate } from "chrono-node"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFormContext } from "react-hook-form"
import { add, isAfter, isBefore, startOfDay } from "date-fns"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function Calendar29({disabled,numerator,id}:{disabled?:boolean,numerator:string,id:string}) {
  const { setValue }=useFormContext()
  const today=new Date()
  const [open, setOpen] = React.useState(false)
  const [value, setvalue] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(value) || undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="px-1">
        {id?.split("_").join(" ")}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={value}
          disabled={disabled}
          placeholder="Tomorrow or next week"
          className="bg-background pr-10"
          onChange={(e) => {
            setvalue(e.target.value)
            const date = parseDate(e.target.value)
            if (date) {
              setDate(date)
              setMonth(date)
              setValue(numerator,date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} 
        onOpenChange={setOpen}>
          <PopoverTrigger
          disabled={disabled}
          asChild>
            <Button
              id="date-picker"
              variant="ghost"
              disabled={disabled}
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              disabled={(date)=>
                isBefore(date,today) || isAfter(date,add(today,{
                    days:120
                }))
              }
              onMonthChange={setMonth}
              onSelect={(data) => {
                setDate(data)
                setValue(numerator,data)
                setOpen(false)
                setvalue(formatDate(data))
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-muted-foreground px-1 text-sm">
        {id.split("_").join(" ")} of task will be on{" "}
        <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  )
}
