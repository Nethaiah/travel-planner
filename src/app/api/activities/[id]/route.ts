import { NextRequest, NextResponse } from "next/server";
import { deleteActivity } from "@/app/server/tripActions";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteActivity(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
} 