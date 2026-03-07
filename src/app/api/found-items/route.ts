import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { items } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(items)
      .where(eq(items.type, "found"))
      .orderBy(desc(items.createdAt)); // Newest found items first

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Found Items Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch found items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Destructure to handle the camelCase keys from your frontend
    const { title, description, userId, address, itemImages } = body;

    const newItem = await db
      .insert(items)
      .values({
        title,
        description,
        userId,
        address,         // Added address support
        itemImages,      // Map frontend itemImages to schema itemImages array
        type: "found",   // Explicitly set to 'found'
        status: "active",
      })
      .returning();

    return NextResponse.json(newItem[0]); // Return the single object, not the array
  } catch (error) {
    console.error("POST Found Item Error:", error);
    return NextResponse.json(
      { error: "Failed to create found item" },
      { status: 500 }
    );
  }
}