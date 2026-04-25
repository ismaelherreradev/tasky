import { auth } from "@clerk/tanstack-react-start/server"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

export const getSession = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: "/",
    })
  }

  return { userId }
})
