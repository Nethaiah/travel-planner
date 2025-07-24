import { NextResponse } from "next/server";
import { deleteTrip } from "@/app/server/tripActions";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params;
    const result = await deleteTrip(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
