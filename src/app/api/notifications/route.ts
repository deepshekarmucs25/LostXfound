import { db } from "@/server/db";
import { notifications } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // userId, message, and type are required per your schema
    // title was removed as it's not in your schema definition
    const { userId, message, type, referenceId } = body;

    if (!userId || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields: userId, message, or type" },
        { status: 400 }
      );
    }

    const data = await db
      .insert(notifications)
      .values({
        userId,
        message,
        type, // Must be: 'message' | 'item_match' | 'item_resolved' | 'report_update'
        referenceId, // Optional: useful for linking to a specific Item ID
        isRead: false,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("POST Notification Error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}