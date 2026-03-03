import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { redirect } from "@tanstack/react-router"
import { Paths } from "~/config/site"

export const getOrgAuth = createServerFn().handler(async () => {
  const { orgId } = await auth()
  if (!orgId) throw redirect({ to: Paths.SelectOrg })
  return { orgId }
})
