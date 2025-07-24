import { NextRequest, NextResponse } from "next/server";
import { deleteActivity } from "@/app/server/tripActions";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const result = await deleteActivity(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}