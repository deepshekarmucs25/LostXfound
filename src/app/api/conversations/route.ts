import { db } from "@/server/db";
import { conversations } from "@/server/db/schema";
import { or, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    // Using relational query for a cleaner nested return
    const data = await db.query.conversations.findMany({
      where: (conv, { or, eq }) =>
        or(eq(conv.ownerId, userId), eq(conv.finderId, userId)),
      with: {
        item: true,
        messages: {
          limit: 1,
          orderBy: (msg, { desc }) => [desc(msg.createdAt)],
        },
      },
      orderBy: [desc(conversations.lastMessageAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Conversations GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}