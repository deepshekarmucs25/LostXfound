import { db } from "@/server/db";
import { notifications } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ Id: string }> }
) {
  try {
    // Await the params to extract the ID (matching your [Id] folder casing)
    const { Id } = await params;
    const notificationId = Number(Id);

    // 1. Validation: Ensure ID is a valid number
    if (isNaN(notificationId)) {
      return NextResponse.json(
        { error: "Invalid Notification ID format" },
        { status: 400 }
      );
    }

    // 2. Update logic: Set isRead to true
    const updatedNotification = await db
      .update(notifications)
      .set({ 
        isRead: true,
        updatedAt: new Date() // Keeping timestamps synchronized
      })
      .where(eq(notifications.id, notificationId))
      .returning();

    // 3. Check if the notification actually existed
    if (updatedNotification.length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedNotification[0] 
    });

  } catch (error) {
    console.error("PATCH Notification Error:", error);
    return NextResponse.json(
      { error: "Failed to update notification status" },
      { status: 500 }
    );
  }
}