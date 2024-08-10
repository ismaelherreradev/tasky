import { TRPCError } from "@trpc/server";

import type { ProtectedTRPCContext } from "./trpc";

export async function validateOrgId(ctx: ProtectedTRPCContext): Promise<string> {
  const { orgId } = ctx.auth;
  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "OrgId not found" });
  }
  return orgId;
}
