import { createFileRoute } from "@tanstack/react-router"
import { OrganizationList } from "@clerk/clerk-react"
import { dark, experimental__simple } from "@clerk/themes"
import { useTheme } from "next-themes"

export const Route = createFileRoute("/_auth/select-org")({
  component: SelectOrgPage,
})

function SelectOrgPage() {
  const { theme } = useTheme()
  return (
    <OrganizationList
      appearance={{ baseTheme: theme === "dark" ? dark : experimental__simple }}
      hidePersonal
      afterCreateOrganizationUrl="/organization/:id"
      afterSelectOrganizationUrl="/organization/:id"
    />
  )
}
