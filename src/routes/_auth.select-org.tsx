import { OrganizationList } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

import { getSessionAuthOnly } from "#/lib/auth.functions"

export const Route = createFileRoute("/_auth/select-org")({
  beforeLoad: async () => {
    const { userId } = await getSessionAuthOnly()
    return { userId }
  },
  component: OrganizationListPage,
})

function OrganizationListPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={(org) => `/organization/${org.id}`}
        afterSelectOrganizationUrl={(org) => `/organization/${org.id}`}
      />
    </div>
  )
}
