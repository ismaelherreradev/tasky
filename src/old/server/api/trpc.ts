import type { getAuth } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";

type AuthObject = ReturnType<typeof getAuth>;

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
  };
};

export const createTRPCContext = async (opts: {
  headers: Headers;
  auth: AuthObject | null;
}) => {
  const innerContext = createInnerTRPCContext({});

  return {
    ...innerContext,
    ...opts,
  };
};

export const createRSCContext = async () => {
  const authData = await auth();
  const innerContext = createInnerTRPCContext({});

  return {
    ...innerContext,
    auth: authData,
    headers: new Headers(),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

const enforceUserInOrganization = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.auth.orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be in an organization to perform this action",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);

export const orgProcedure = publicProcedure.use(enforceUserInOrganization);

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type RSCContext = Awaited<ReturnType<typeof createRSCContext>>;

export type ProtectedTRPCContext = TRPCContext & {
  auth: NonNullable<TRPCContext["auth"]> & {
    userId: string;
  };
  db: typeof db;
};

export type OrgTRPCContext = TRPCContext & {
  auth: NonNullable<TRPCContext["auth"]> & {
    userId: string;
    orgId: string;
  };
  db: typeof db;
};
