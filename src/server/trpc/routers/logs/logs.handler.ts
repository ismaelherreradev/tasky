import { entityTypeEnum } from "#/server/db/schema"

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

export async function getAllAuditLogs({ ctx }: { ctx: ProtectedTRPCContext }) {
  const orgId = await validateOrgId(ctx)

  const logs = await ctx.db.query.auditLogs.findMany({
    where: {
      orgId,
    },
    orderBy: { createdAt: "desc" },
  })

  return logs ?? null
}
