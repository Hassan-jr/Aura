import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/dashboard/sentiment"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sentiment Analysis
      </Link>
      <Link
        href="/dashboard/products"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Products
      </Link>
      <Link
        href="/dashboard/agent"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        S.E.O Analysis Agent
      </Link>
    </nav>
  )
}
