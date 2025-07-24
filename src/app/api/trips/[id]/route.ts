import { NextResponse } from "next/server";
import { deleteTrip } from "@/app/server/tripActions";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const result = await deleteTrip(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
