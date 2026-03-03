import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    TURSO_DATABASE_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_APP_URL: z.string().url().optional(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    VITE_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  },
  runtimeEnvStrict: {
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_CLERK_SIGN_IN_URL: import.meta.env.VITE_CLERK_SIGN_IN_URL,
    VITE_CLERK_SIGN_UP_URL: import.meta.env.VITE_CLERK_SIGN_UP_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
