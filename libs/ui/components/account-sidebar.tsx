"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SettingsSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    disabled?: boolean
  }[]
}

export function SettingsSidebar({
  className,
  items,
  ...props
}: SettingsSidebarProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? "#" : item.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            pathname === item.href && "bg-muted hover:bg-muted",
            item.disabled && "cursor-not-allowed text-black opacity-50",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
