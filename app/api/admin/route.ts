import { getServerUserRole } from "@/lib/server-user-role";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const userRole = await getServerUserRole();

  if (userRole === UserRole.ADMIN) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ success: false }, { status: 403 });
}
