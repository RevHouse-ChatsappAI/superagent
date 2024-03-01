import Link from "next/link"

import { cn } from "@/lib/utils"

export function PromptFooter({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-muted-foreground px-2 text-center text-xs leading-normal",
        className
      )}
      {...props}
    >
      Powered by{" "}
      <Link passHref href="https://development.chatsappai.com/">
        <span className="text-foreground">Chatsappai.com/</span>
      </Link>
    </p>
  )
}
