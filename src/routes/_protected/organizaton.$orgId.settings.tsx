import { OrganizationProfile } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/organizaton/$orgId/settings")({
  component: OrganizatonSettingsPage,
})

function OrganizatonSettingsPage() {
  return (
    <div className="w-full">
      <OrganizationProfile />
    </div>
  )
}
