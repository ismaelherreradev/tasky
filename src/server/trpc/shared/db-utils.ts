import { clerkClient } from "@clerk/tanstack-react-start/server"
import { TRPCError } from "@trpc/server"

import { type Action, auditLogs, type EntityType } from "#/server/db/schema"

import type { ProtectedTRPCContext } from "../init"

export async function validateOrgId(ctx: ProtectedTRPCContext): Promise<string> {
  const orgId = ctx.auth.orgId
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    })
  }
  return orgId
}

export function requireOrgAccess(ctx: ProtectedTRPCContext) {
  const orgId = ctx.auth.orgId
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    })
  }
  return { ...ctx, auth: { ...ctx.auth, orgId } }
}

export function validateOrgAccess(ctx: ProtectedTRPCContext, inputOrgId: string): void {
  if (ctx.auth.orgId !== inputOrgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization access denied",
    })
  }
}

export async function createAuditLog(
  ctx: ProtectedTRPCContext,
  params: {
    orgId: string
    action: Action
    entityId: number
    entityType: EntityType
    entityTitle: string
  },
) {
  try {
    const userId = ctx.auth.userId

    const clerk = clerkClient()
    const user = await clerk.users.getUser(userId)
    const firstName = user.firstName ?? ""
    const lastName = user.lastName ?? ""
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown User"
    const imageUrl = user.imageUrl ?? ""

    await ctx.db.insert(auditLogs).values({
      orgId: params.orgId,
      action: params.action,
      entityId: params.entityId,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
      userId,
      userImage: imageUrl,
      userName: fullName,
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}
