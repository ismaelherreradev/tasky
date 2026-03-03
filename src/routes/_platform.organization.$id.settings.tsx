import { createFileRoute } from "@tanstack/react-router"
import OrganizationProfileSettings from "~/components/organization/organization-profile"

export const Route = createFileRoute("/_platform/organization/$id/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="w-full">
      <OrganizationProfileSettings />
    </div>
  )
}
