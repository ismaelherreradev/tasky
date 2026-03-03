import { createFileRoute, Outlet } from "@tanstack/react-router"
import ClerkLayout from "~/components/layout/clerk-layout"

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <ClerkLayout>
      <Outlet />
    </ClerkLayout>
  )
}
