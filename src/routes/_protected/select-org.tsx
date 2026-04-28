import { OrganizationList } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/select-org")({
  component: OrganizationListPage,
})

function OrganizationListPage() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl={(org) => `/app/organization/${org.id}`}
      afterSelectOrganizationUrl={(org) => `/app/organization/${org.id}`}
    />
  )
}
