"use client"

import * as React from "react"
import {
  CreditCard,
  Settings,
  User,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { items } from "@/constants/dashboard"
import Link from "next/link"

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <section 
      className="text-muted-foreground text-sm bg-secondary/60 px-4 py-2 rounded-xl flex items-center gap-5 cursor-pointer"
      onClick={()=>{
        setOpen(!open)
      }}
      >
        <p className="hidden sm:block">Go to a particular page</p>
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </section>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {items.map((item)=>(
              <CommandItem key={item.title}>
                <Link className="flex item-center gap-3" href={item.link}>
                  <item.icon/>
                  <span>{item.title}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
