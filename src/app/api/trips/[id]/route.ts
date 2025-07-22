import { NextResponse } from "next/server";
import { deleteTrip } from "@/app/server/tripActions";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteTrip(params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
