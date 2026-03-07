import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { items } from "@/server/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET() {
  try {
    const [lostRes, foundRes, resolvedRes, recentItems] = await Promise.all([
      // 'lost' and 'found' belong to the 'type' column
      db.select({ value: count() }).from(items).where(eq(items.type, "lost")),
      db.select({ value: count() }).from(items).where(eq(items.type, "found")),
      // 'resolved' belongs to the 'status' column
      db.select({ value: count() }).from(items).where(eq(items.status, "resolved")),
      db.select()
        .from(items)
        .orderBy(desc(items.createdAt))
        .limit(5)
    ]);

    return NextResponse.json({
      lost: Number(lostRes[0]?.value ?? 0),
      found: Number(foundRes[0]?.value ?? 0),
      resolved: Number(resolvedRes[0]?.value ?? 0),
      recent: recentItems,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}