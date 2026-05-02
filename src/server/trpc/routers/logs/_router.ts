import { createTRPCRouter, protectedProcedure } from "../../init"
import * as handler from "./logs.handler"
import * as schema from "./logs.schema"

export const logsRouter = createTRPCRouter({
  getAuditLogs: protectedProcedure.input(schema.ZGetAuditLogs).query(handler.getAuditLogs),

  getAllAuditLogs: protectedProcedure.input(schema.ZGetAllAuditLogs).query(handler.getAllAuditLogs),
})
