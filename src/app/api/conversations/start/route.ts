import { db } from "@/server/db";
import { conversations } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, ownerId, senderId } = body;

    // 1. Basic validation
    if (!itemId || !ownerId || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Safety: Ensure itemId is a number for the database query
    const numericItemId = Number(itemId);

    /*
    // Prevents a user from starting a chat with themselves
    if (ownerId === senderId) {
      return NextResponse.json({ 
        error: "You cannot start a chat with yourself. Please log in with a different account to test contacting this owner." 
      }, { status: 400 });
    }

    */
    // 2. Check if a conversation already exists for this item/user pair
    const existingConversation = await db.query.conversations.findFirst({
      where: and(
        eq(conversations.itemId, numericItemId),
        eq(conversations.ownerId, ownerId),
        eq(conversations.finderId, senderId)
      ),
    });

    if (existingConversation) {
      return NextResponse.json({ conversationId: existingConversation.id });
    }

    // 3. Create a new conversation if it doesn't exist
    const result = await db
      .insert(conversations)
      .values({
        itemId: numericItemId,
        ownerId,
        finderId: senderId,
      })
      .returning();

    // Safely grab the first element
    const newConversation = result[0];

    // Handle the "undefined" possibility to satisfy the linter
    if (!newConversation) {
      return NextResponse.json(
        { error: "Failed to create conversation" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ conversationId: newConversation.id });
  } catch (error) {
    console.error("CONVERSATION_START_ERROR:", error);
    return NextResponse.json({ error: "Failed to initiate chat" }, { status: 500 });
  }
}