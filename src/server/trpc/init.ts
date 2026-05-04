import type { auth } from "@clerk/tanstack-react-start/server"
import type { D1Database } from "@cloudflare/workers-types"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { z } from "zod"

import { createDb } from "#/server/db"

type AuthObject = Awaited<ReturnType<typeof auth>>

export const createTRPCContext = async (opts: {
  headers: Headers
  auth: AuthObject | null
  env: { DB: D1Database }
}) => {
  return {
    db: createDb(opts.env),
    auth: opts.auth,
    headers: opts.headers,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

const enforceUserInOrganization = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be in an organization to perform this action",
    })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

export type ProtectedTRPCContext = TRPCContext & {
  auth: NonNullable<TRPCContext["auth"]> & {
    userId: string
  }
}

export type OrgTRPCContext = TRPCContext & {
  auth: NonNullable<TRPCContext["auth"]> & {
    userId: string
    orgId: string
  }
}

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
export const orgProcedure = protectedProcedure.use(enforceUserInOrganization)
export const createCallerFactory = t.createCallerFactory
