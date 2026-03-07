import { db } from "@/server/db";
import { messages, conversations } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET messages of a conversation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = Number(searchParams.get("conversationId"));

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
    }

    const data = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      with: {
        sender: true,
      },
      orderBy: [asc(messages.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST new message
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, senderId, message, imageUrl } = body;

    if (!conversationId || !senderId || (!message && !imageUrl)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Insert the message
    const [newMessage] = await db.insert(messages).values({
      conversationId,
      senderId,
      message,
      imageUrl,
    }).returning();

    // 2. Update the conversation timestamp (Critical for sorting chat lists)
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Message POST Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}