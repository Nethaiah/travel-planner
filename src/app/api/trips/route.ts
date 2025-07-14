import { NextRequest, NextResponse } from "next/server"
import { getTripsByUser } from "@/app/server/tripActions"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const trips = await getTripsByUser(session.user.id)
    return NextResponse.json({ trips })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch trips" }, { status: 500 })
  }
} 