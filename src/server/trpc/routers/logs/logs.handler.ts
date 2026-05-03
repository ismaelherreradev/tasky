import { count, eq } from "drizzle-orm"

import { auditLogs, entityTypeEnum } from "#/server/db/schema"

import type { ProtectedTRPCContext } from "../../init"
import { validateOrgId } from "../../shared/db-utils"
import type * as Schema from "./logs.schema"

type Logs<T> = {
  ctx: ProtectedTRPCContext
  input: T
}

export async function getAuditLogs({ ctx, input }: Logs<Schema.TGetAuditLogs>) {
  const { id } = input
  const orgId = await validateOrgId(ctx)

  const auditLogsQuery = await ctx.db.query.auditLogs.findMany({
    where: {
      orgId,
      entityId: id,
      entityType: entityTypeEnum.CARD,
    },
    orderBy: { createdAt: "desc" },
    limit: 3,
  })

  return auditLogsQuery ?? null
}

export async function getAllAuditLogs({ ctx, input }: Logs<Schema.TGetAllAuditLogs>) {
  const { page, limit } = input
  const orgId = await validateOrgId(ctx)
  const offset = (page - 1) * limit

  const [logs, totalCountResult] = await Promise.all([
    ctx.db.query.auditLogs.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      limit,
      offset,
    }),
    ctx.db.select({ value: count() }).from(auditLogs).where(eq(auditLogs.orgId, orgId)),
  ])

  return {
    items: logs ?? [],
    totalCount: totalCountResult[0]?.value ?? 0,
  }
}
