import { auth } from "@clerk/tanstack-react-start/server"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

export const getSessionAuthOnly = createServerFn().handler(async () => {
  try {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated) {
      throw redirect({
        to: "/",
      })
    }

    return { userId }
  } catch {
    throw redirect({
      to: "/",
    })
  }
})

export const getSession = createServerFn().handler(async () => {
  try {
    const { isAuthenticated, userId, orgId } = await auth()

    if (!isAuthenticated) {
      throw redirect({
        to: "/",
      })
    } else if (!orgId) {
      throw redirect({
        to: "/select-org",
      })
    }

    return { userId, orgId }
  } catch {
    throw redirect({
      to: "/",
    })
  }
})
