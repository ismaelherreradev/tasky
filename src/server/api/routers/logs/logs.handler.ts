import { and, desc, eq } from "drizzle-orm";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { auditLogs, entityTypeEnum } from "~/server/db/schema";

import { validateOrgId } from "../../shared/db-utils";
import type * as Schema from "./logs.schema";

type Logs<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

export async function getAuditLogs({ ctx, input }: Logs<Schema.TGetAuditLogs>) {
  const { id } = input;
  const orgId = await validateOrgId(ctx);

  const auditLogsQuery = await ctx.db
    .select()
    .from(auditLogs)
    .where(
      and(
        eq(auditLogs.orgId, orgId),
        eq(auditLogs.entityId, id),
        eq(auditLogs.entityType, entityTypeEnum.CARD),
      ),
    )
    .orderBy(desc(auditLogs.createdAt))
    .limit(3);

  return auditLogsQuery ?? null;
}

export async function getAllAuditLogs({ ctx }: { ctx: ProtectedTRPCContext }) {
  const orgId = await validateOrgId(ctx);

  const logs = await ctx.db.query.auditLogs.findMany({
    where: (auditLogs, { eq }) => eq(auditLogs.orgId, orgId),
  });

  return logs ?? null;
}
