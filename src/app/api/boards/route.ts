// app/api/boards/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { boards } from "~/server/db/schema"; // Adjust the import according to your schema path
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");

  if (!orgId) {
    return NextResponse.json({ error: "orgId is required" }, { status: 400 });
  }

  try {
    const boardResults = await db.query.boards.findMany({
      where: eq(boards.orgId, orgId),
      orderBy: [desc(boards.createdAt)],
    });
    return NextResponse.json(boardResults, { status: 200 });
  } catch (_) {
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}
