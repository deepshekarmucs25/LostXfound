import { NextResponse } from "next/server";
import { db } from "@/server/db"; 
import { items } from "@/server/db/schema"; 
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const lostItems = await db
      .select()
      .from(items)
      .where(eq(items.type, "lost"))
      .orderBy(desc(items.createdAt)); 

    return NextResponse.json(lostItems);
  } catch (error) {
    console.error("GET Lost Items Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lost items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, description, userId, address, itemImages } = body;

    // Validation to prevent empty inserts
    if (!title || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db
      .insert(items)
      .values({
        title,
        description,
        address,
        itemImages: itemImages, 
        type: "lost",
        userId,
        status: "active",
      })
      .returning();

    // Safety Fix: Ensure we have a record before returning [0]
    const newItem = result[0];
    if (!newItem) {
      return NextResponse.json({ error: "Failed to record item" }, { status: 500 });
    }

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("POST Lost Item Error:", error);
    return NextResponse.json(
      { error: "Failed to create lost item" },
      { status: 500 }
    );
  }
}