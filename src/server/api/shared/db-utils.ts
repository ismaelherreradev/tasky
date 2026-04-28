import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq, type SQL } from "drizzle-orm";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { type Action, auditLogs, type EntityType } from "~/server/db/schema";

export async function validateOrgId(
  ctx: ProtectedTRPCContext,
): Promise<string> {
  const orgId = ctx.auth.orgId;
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    });
  }
  return orgId;
}

export function requireOrgAccess(ctx: ProtectedTRPCContext) {
  const orgId = ctx.auth.orgId;
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    });
  }
  return { ...ctx, auth: { ...ctx.auth, orgId } };
}

export function validateOrgAccess(
  ctx: ProtectedTRPCContext,
  inputOrgId: string,
): void {
  if (ctx.auth.orgId !== inputOrgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization access denied",
    });
  }
}

export async function createAuditLog(
  ctx: ProtectedTRPCContext,
  params: {
    orgId: string;
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  try {
    const userId = ctx.auth.userId;

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const firstName = user.firstName ?? "";
    const lastName = user.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
    const imageUrl = user.imageUrl ?? "";

    await ctx.db.insert(auditLogs).values({
      orgId: params.orgId,
      action: params.action,
      entityId: params.entityId,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
      userId,
      userImage: imageUrl,
      userName: fullName,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function createOrgAuditLog(
  orgCtx: ProtectedTRPCContext & { auth: { orgId: string } },
  params: {
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  await createAuditLog(orgCtx, {
    orgId: orgCtx.auth.orgId,
    ...params,
  });
}

export function createOrgAccessCondition<T extends { orgId: unknown }>(
  table: T,
  orgId: string,
): SQL {
  return eq(table.orgId as Parameters<typeof eq>[0], orgId);
}

export async function executeInTransaction<T>(
  ctx: ProtectedTRPCContext,
  callback: (
    tx: Parameters<typeof ctx.db.transaction>[0] extends (
      tx: infer U,
    ) => unknown
      ? U
      : never,
  ) => Promise<T>,
): Promise<T> {
  return await ctx.db.transaction(callback);
}
