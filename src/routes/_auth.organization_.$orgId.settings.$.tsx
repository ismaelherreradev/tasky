import { OrganizationProfile } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/organization_/$orgId/settings/$")({
  component: OrganizatonSettingsPage,
})

function OrganizatonSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <OrganizationProfile />
    </div>
  )
}
