import { z } from "zod";

export const ZGetAuditLogs = z.object({
  id: z.number(),
});

export type TGetAuditLogs = z.infer<typeof ZGetAuditLogs>;
