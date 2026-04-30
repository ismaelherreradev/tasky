import { createTRPCRouter, protectedProcedure } from "#/integrations/trpc/init"

import * as handler from "./logs.handler"
import * as schema from "./logs.schema"

export const logsRouter = createTRPCRouter({
  getAuditLogs: protectedProcedure.input(schema.ZGetAuditLogs).query(handler.getAuditLogs),

  getAllAuditLogs: protectedProcedure.query(handler.getAllAuditLogs),
})
