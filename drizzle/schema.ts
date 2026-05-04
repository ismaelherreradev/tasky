import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const taskyV2AuditLog = sqliteTable("tasky-v2_audit_log", {
	id: integer().primaryKey({ autoIncrement: true }),
	orgId: text("org_id").notNull(),
	action: text().notNull(),
	entityId: integer("entity_id").notNull(),
	entityType: text("entity_type").notNull(),
	entityTitle: text("entity_title").notNull(),
	userId: text("user_id").notNull(),
	userImage: text("user_image").notNull(),
	userName: text("user_name").notNull(),
	createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
	updatedAt: integer("updated_at"),
});

export const taskyV2Board = sqliteTable("tasky-v2_board", {
	id: integer().primaryKey({ autoIncrement: true }),
	orgId: text().notNull(),
	title: text().notNull(),
	createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
	updatedAt: integer("updated_at"),
});

export const taskyV2Card = sqliteTable("tasky-v2_card", {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	order: integer().notNull(),
	description: text(),
	listId: integer("list_id").notNull(),
	createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
	updatedAt: integer("updated_at"),
},
(table) => [index("listIdx").on(table.listId),
]);

export const taskyV2List = sqliteTable("tasky-v2_list", {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	color: text(),
	order: integer().notNull(),
	boardId: integer("board_id").notNull(),
	createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
	updatedAt: integer("updated_at"),
},
(table) => [index("boardIdx").on(table.boardId),
]);

