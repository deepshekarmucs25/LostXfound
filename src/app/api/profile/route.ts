import { db } from "@/server/db"
import { user } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  const data = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { userId, name, avatar } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required for updates" }, { status: 400 })
    }

    // Defensive update: only set fields that are actually provided in the body
    const updateData: Partial<typeof user.$inferSelect> = {}
    if (name !== undefined) updateData.name = name
    if (avatar !== undefined) updateData.image = avatar // Matching 'image' column in standard schemas

    const updated = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Profile PATCH Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}