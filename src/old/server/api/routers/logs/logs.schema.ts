import type { z } from "zod";

import { createEntitySchema, idSchema } from "../../shared/schema-utils";

export const ZGetAuditLogs = createEntitySchema({
  id: idSchema,
});

export type TGetAuditLogs = z.infer<typeof ZGetAuditLogs>;
