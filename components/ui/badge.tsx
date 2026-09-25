import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none border px-3 py-1 text-xs font-medium leading-tight",
  {
    variants: {
      tone: {
        neutral:
          "bg-[var(--gray-100)] text-[var(--gray-700)] border-[var(--gray-200)]",
        accent:
          "bg-[var(--blue-50)] text-[var(--blue-700)] border-[var(--blue-100)]",
        success:
          "bg-[var(--success-bg)] text-[var(--success)] border-[#c4ead2]",
        warning:
          "bg-[var(--warning-bg)] text-[var(--warning)] border-[#f4e3bd]",
        danger: "bg-[var(--danger-bg)] text-[var(--danger)] border-[#f6d4d4]",
        solid: "bg-[var(--gray-900)] text-white border-[var(--gray-900)]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}

export { Badge, badgeVariants }
