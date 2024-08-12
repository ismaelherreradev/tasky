import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { db } from "../db";
import { auditLogs, type Action, type EntityType } from "../db/schema";
import type { ProtectedTRPCContext } from "./trpc";

export async function validateOrgId(ctx: ProtectedTRPCContext): Promise<string> {
  const { orgId } = ctx.auth;
  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "OrgId not found" });
  }
  return orgId;
}

export async function createAuditLog(data: {
  orgId: string;
  action: Action;
  entityId: number;
  entityType: EntityType;
  entityTitle: string;
  userId?: string;
  userImage?: string;
  userName?: string;
}) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
    }

    const updateData = {
      orgId: data.orgId,
      action: data.action,
      entityId: data.entityId,
      entityType: data.entityType,
      entityTitle: data.entityTitle,
      userId: user.id,
      userImage: user.imageUrl,
      userName: `${user.firstName} ${user.lastName}`,
    };

    const newAuditLog = await db.insert(auditLogs).values(updateData).returning();
    return newAuditLog[0];
  } catch (error) {
    console.error("Error creating audit log:", error);
    throw error;
  }
}
