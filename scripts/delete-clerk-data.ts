#!/usr/bin/env bun

import { createClerkClient } from "@clerk/express"

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")

if (!dryRun && !args.includes("--confirm")) {
  console.log("Usage:")
  console.log("  bun run scripts/delete-clerk-data.ts --dry-run   # Preview what will be deleted")
  console.log("  bun run scripts/delete-clerk-data.ts --confirm # Actually delete (DANGEROUS)")
  process.exit(1)
}

const clerkSecretKey = process.env.CLERK_SECRET_KEY
if (!clerkSecretKey) {
  console.error("Error: CLERK_SECRET_KEY not found in environment")
  process.exit(1)
}

const clerk = createClerkClient({ secretKey: clerkSecretKey })

async function deleteOrganizations() {
  console.log("\n=== Organizations ===\n")

  let offset = 0
  const limit = 100
  let totalDeleted = 0

  while (true) {
    const { data: orgs, totalCount } = await clerk.organizations.getOrganizationList({
      limit,
      offset,
    })

    if (orgs.length === 0) {
      console.log("No organizations found.")
      return
    }

    for (const org of orgs) {
      console.log(`  - ${org.name} (${org.id})`)

      if (!dryRun) {
        await clerk.organizations.deleteOrganization(org.id)
        console.log(`    -> DELETED`)
        totalDeleted++
      } else {
        console.log(`    -> [DRY-RUN] Would delete`)
      }
    }

    if (offset + orgs.length >= totalCount) {
      break
    }
    offset += orgs.length
  }

  if (!dryRun) {
    console.log(`\nDeleted ${totalDeleted} organizations.`)
  }
}

async function deleteUsers() {
  console.log("\n=== Users ===\n")

  let offset = 0
  const limit = 100
  let totalDeleted = 0

  while (true) {
    const { data: users, totalCount } = await clerk.users.getUserList({
      limit,
      offset,
    })

    if (users.length === 0) {
      console.log("No users found.")
      return
    }

    for (const user of users) {
      const email = user.emailAddresses[0]?.emailAddress || "no email"
      console.log(`  - ${user.firstName} ${user.lastName} <${email}> (${user.id})`)

      if (!dryRun) {
        await clerk.users.deleteUser(user.id)
        console.log(`    -> DELETED`)
        totalDeleted++
      } else {
        console.log(`    -> [DRY-RUN] Would delete`)
      }
    }

    if (offset + users.length >= totalCount) {
      break
    }
    offset += users.length
  }

  if (!dryRun) {
    console.log(`\nDeleted ${totalDeleted} users.`)
  }
}

async function main() {
  if (dryRun) {
    console.log("=== DRY RUN MODE ===")
    console.log("No actual deletions will be performed.\n")
  }

  console.log("Fetching organizations...")
  await deleteOrganizations()

  console.log("\nFetching users...")
  await deleteUsers()

  if (dryRun) {
    console.log("\n=== DRY RUN COMPLETE ===")
    console.log("Run with --confirm to actually delete.")
  }
}

main().catch(console.error)
