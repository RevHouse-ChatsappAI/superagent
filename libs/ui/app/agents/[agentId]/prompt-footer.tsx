import Link from "next/link"

import { cn } from "@/lib/utils"

export function PromptFooter({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      Powered by{" "}
      <Link passHref href="https://beta.chatsappai.com/">
        <span className="text-foreground">ChatsAppAI Cloud</span>
      </Link>
    </p>
  )
}
