import { defineRelations } from "drizzle-orm"

import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
  boards: {
    lists: r.many.lists({
      from: r.boards.id,
      to: r.lists.boardId,
    }),
  },
  lists: {
    board: r.one.boards({
      from: r.lists.boardId,
      to: r.boards.id,
    }),
    cards: r.many.cards({
      from: r.lists.id,
      to: r.cards.listId,
    }),
  },
  cards: {
    list: r.one.lists({
      from: r.cards.listId,
      to: r.lists.id,
    }),
  },
  auditLogs: {},
}))
