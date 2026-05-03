### Tasky - Simplify task management.

## Stack

TanStack Start · tRPC + Drizzle ORM · Tailwind CSS 4 · Clerk Auth

## Features

- Kanban boards with drag-and-drop
- Lists & cards organization
- Activity tracking

## Setup

```bash
bun install
bun run db:generate && bun run db:migrate
# Add CLERK_SECRET_KEY and TURSO_DB_URL to .env
bun run dev
```

## Deploy

`bun run deploy` → Cloudflare Pages
