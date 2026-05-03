import { z } from "zod"

import { idSchema } from "../../shared/schema-utils"

export const ZGetAuditLogs = z.object({
  id: idSchema,
})

export type TGetAuditLogs = z.infer<typeof ZGetAuditLogs>
export const ZGetAllAuditLogs = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export type TGetAllAuditLogs = z.infer<typeof ZGetAllAuditLogs>
