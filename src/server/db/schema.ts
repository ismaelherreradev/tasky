// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  integer,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = sqliteTableCreator((name) => `tasky-v2_${name}`);

// Define the Board table
export const boards = createTable("board", {
  id: text("id").primaryKey().default(`uuid()`),
  orgId: text("orgId").notNull(),
  title: text("title").notNull(),
  imageId: text("imageId").notNull(),
  imageThumbUrl: text("image_thumb_url").notNull(),
  imageFullUrl: text("image_full_url").notNull(),
  imageUserName: text("image_user_name").notNull(),
  imageLinkHTML: text("image_link_html").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

// Define the List table
export const lists = createTable(
  "list",
  {
    id: text("id").primaryKey().default(`uuid()`),
    title: text("title").notNull(),
    order: integer("order").notNull(),
    boardId: text("board_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => {
    return {
      boardIdx: index("boardIdx").on(t.boardId),
    };
  },
);

// Define the Card table
export const cards = createTable(
  "card",
  {
    id: text("id").primaryKey().default(`uuid()`),
    title: text("title").notNull(),
    order: integer("order").notNull(),
    description: text("description"),
    listId: text("list_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => {
    return {
      listIdx: index("listIdx").on(t.listId),
    };
  },
);

// Define the AuditLog table
export const auditLogs = createTable("audit_log", {
  id: text("id").primaryKey().default(`uuid()`),
  orgId: text("org_id").notNull(),
  action: text("action").notNull(),
  entityId: text("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  entityTitle: text("entity_title").notNull(),
  userId: text("user_id").notNull(),
  userImage: text("user_image").notNull(),
  userName: text("user_name").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

// Define the OrgLimit table
export const orgLimits = createTable("org_limit", {
  id: text("id").primaryKey().default(`uuid()`),
  orgId: text("org_id").unique().notNull(),
  count: integer("count").default(0),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

// Define relationships
export const boardRelations = relations(boards, ({ many }) => ({
  lists: many(lists),
}));

export const listRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id],
  }),
  cards: many(cards),
}));

export const cardRelations = relations(cards, ({ one }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id],
  }),
}));
