import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { auditLogs, entityTypeEnum } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

import { validateOrgId } from "../../utils";
import type * as Schema from "./logs.schema";

type Logs<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

export async function getAuditLogs({ ctx, input }: Logs<Schema.TGetAuditLogs>) {
  const { id } = input;
  const orgId = await validateOrgId(ctx);

  if (!id || !orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid card ID" });
  }

  const auditLogsQuery = await ctx.db
    .select()
    .from(auditLogs)
    .where(
      and(
        eq(auditLogs.orgId, orgId),
        eq(auditLogs.entityId, id),
        eq(auditLogs.entityType, entityTypeEnum.CARD), // "CARD"
      ),
    )
    .orderBy(desc(auditLogs.createdAt)) // Use desc directly
    .limit(3);

  return auditLogsQuery ?? null;
}
