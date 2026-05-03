import { SmileySadIcon } from "@phosphor-icons/react"
import { useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SmileySadIcon className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Page not found</EmptyTitle>
        <EmptyDescription>This page doesn&apos;t exist or has been moved.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
      </EmptyContent>
    </Empty>
  )
}
