# Tasky - Project Management Platform

A modern, full-stack project management application built with Next.js 15, featuring task boards, team collaboration, and role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?style=flat-square)

## ✨ Features

- 🔐 **Authentication & User Management** - Powered by Clerk with organization support
- 👥 **Role-based Access Control** - Granular permissions for team management
- 📋 **Task Board** - Kanban-style boards with drag-and-drop functionality
- 🏢 **Project Management** - Comprehensive project organization and tracking
- 📊 **Activity Logging** - Track all project activities and changes
- 📢 **Lead Management** - Capture and manage leads from funnels
- 🌓 **Dark/Light Mode** - Beautiful theme switching with system preference support
- 📱 **Responsive Design** - Works seamlessly across all devices

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: Jotai + TanStack Query
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Type Safety**: TypeScript with strict mode

### Backend

- **API Layer**: tRPC for end-to-end type safety
- **Database**: Turso (libSQL) with Drizzle ORM
- **Authentication**: Clerk
- **Validation**: Zod schemas
- **Runtime**: Bun for fast package management

### Developer Experience

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier with Tailwind plugin
- **Git Hooks**: Lefthook for pre-commit validation
- **Type Checking**: TypeScript strict mode
- **Commit Linting**: Conventional commits with commitlint

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.0.0 (recommended) or Node.js >= 18.0.0
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tasky
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:

   ```env
   # Database (Turso)
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   # Generate database schema
   bun run db:generate

   # Apply migrations
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

### Environment Setup

#### Turso Database

1. Create a Turso account at [turso.tech](https://turso.tech)
2. Create a new database
3. Get your database URL and auth token
4. Add them to your `.env` file

#### Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable key and secret key
4. Configure sign-in/sign-up URLs
5. Add the keys to your `.env` file

### Database Management

The project uses Drizzle ORM with Turso (libSQL) for the database layer.

```bash
# View your database in Drizzle Studio
bun run db:studio

# Generate new migrations after schema changes
bun run db:generate

# Apply migrations to your database
bun run db:migrate

# Push schema changes directly (dev only)
bun run db:push
```

The application will be available at http://localhost:3000.
