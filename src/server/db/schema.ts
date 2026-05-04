import { sql } from "drizzle-orm"
import { index, int, integer, text, sqliteTable } from "drizzle-orm/sqlite-core"

// Enums
export const actionEnum = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const
export type Action = (typeof actionEnum)[keyof typeof actionEnum]

export const entityTypeEnum = {
  BOARD: "BOARD",
  LIST: "LIST",
  CARD: "CARD",
} as const
export type EntityType = (typeof entityTypeEnum)[keyof typeof entityTypeEnum]

// Boards
export const boards = sqliteTable("board", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orgId: text("orgId").notNull(),
  title: text("title").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
})
export type BoardSelect = typeof boards.$inferSelect
export type BoardInsert = typeof boards.$inferInsert

// Lists
export const lists = sqliteTable(
  "list",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    color: text("color"),
    order: integer("order").notNull(),
    boardId: integer("board_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  },
  (t) => [index("boardIdx").on(t.boardId)],
)
export type ListSelect = typeof lists.$inferSelect
export type ListInsert = typeof lists.$inferInsert

// Cards
export const cards = sqliteTable(
  "card",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    order: integer("order").notNull(),
    description: text("description"),
    listId: integer("list_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  },
  (t) => [index("listIdx").on(t.listId)],
)
export type CardSelect = typeof cards.$inferSelect
export type CardInsert = typeof cards.$inferInsert

// Audit Logs
export const auditLogs = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orgId: text("org_id").notNull(),
  action: text("action").$type<Action>().notNull(),
  entityId: integer("entity_id").notNull(),
  entityType: text("entity_type").$type<EntityType>().notNull(),
  entityTitle: text("entity_title").notNull(),
  userId: text("user_id").notNull(),
  userImage: text("user_image").notNull(),
  userName: text("user_name").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
})
export type AuditLogsSelect = typeof auditLogs.$inferSelect
export type AuditLogsInsert = typeof auditLogs.$inferInsert
