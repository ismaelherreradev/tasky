import { z } from "zod"

import { idSchema } from "#/integrations/trpc/shared/schema-utils"

export const ZGetAuditLogs = z.object({
  id: idSchema,
})

export type TGetAuditLogs = z.infer<typeof ZGetAuditLogs>
