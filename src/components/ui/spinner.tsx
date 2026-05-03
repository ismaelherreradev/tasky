import { Spinner as PhosphorSpinner } from "@phosphor-icons/react"
import type React from "react"

import { cn } from "#/lib/utils"

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof PhosphorSpinner>): React.ReactElement {
  return (
    <PhosphorSpinner
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      weight="duotone"
      {...props}
    />
  )
}
