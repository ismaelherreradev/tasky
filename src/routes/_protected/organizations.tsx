import { OrganizationList } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/organizations")({
  component: OrganizationListPage,
})

function OrganizationListPage() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl={(org) => `/organization/${org.slug}`}
      afterSelectOrganizationUrl={(org) => `/organization/${org.slug}`}
    />
  )
}
