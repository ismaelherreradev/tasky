import { TRPCError } from "@trpc/server";

import { type Action, auditLogs, type EntityType } from "../db/schema";
import type { OrgTRPCContext, ProtectedTRPCContext } from "./trpc";

export function validateOrgId(ctx: ProtectedTRPCContext): string {
  const { orgId } = ctx.auth;
  if (!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be in an organization to perform this action",
    });
  }
  return orgId;
}

export function getUserFromContext(ctx: ProtectedTRPCContext) {
  const { userId } = ctx.auth;

  const sessionClaims = ctx.auth.sessionClaims;
  const firstName = sessionClaims?.firstName as string | undefined;
  const lastName = sessionClaims?.lastName as string | undefined;
  const imageUrl = sessionClaims?.imageUrl as string | undefined;

  return {
    userId,
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    imageUrl: imageUrl ?? "",
    fullName: `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown User",
  };
}

export async function createAuditLog(
  ctx: ProtectedTRPCContext,
  data: {
    orgId: string;
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  try {
    const user = getUserFromContext(ctx);

    const auditLogData = {
      orgId: data.orgId,
      action: data.action,
      entityId: data.entityId,
      entityType: data.entityType,
      entityTitle: data.entityTitle,
      userId: user.userId,
      userImage: user.imageUrl,
      userName: user.fullName,
    };

    const [newAuditLog] = await ctx.db
      .insert(auditLogs)
      .values(auditLogData)
      .returning();

    return newAuditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create audit log",
      cause: error,
    });
  }
}

export async function createOrgAuditLog(
  ctx: OrgTRPCContext,
  data: {
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  return createAuditLog(ctx, {
    ...data,
    orgId: ctx.auth.orgId,
  });
}

export function validateOrgAccess(
  ctx: ProtectedTRPCContext,
  resourceOrgId: string,
) {
  const userOrgId = ctx.auth.orgId;

  if (!userOrgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be in an organization to access this resource",
    });
  }

  if (userOrgId !== resourceOrgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have access to this organization's resources",
    });
  }
}

export function hasOrgAccess(ctx: ProtectedTRPCContext): ctx is OrgTRPCContext {
  return !!ctx.auth.orgId;
}

export function requireOrgAccess(ctx: ProtectedTRPCContext): OrgTRPCContext {
  if (!hasOrgAccess(ctx)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be in an organization to perform this action",
    });
  }
  return ctx;
}
