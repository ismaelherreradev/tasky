import { drizzle } from "drizzle-orm/libsql"

import { relations } from "./relations"

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  relations,
})
