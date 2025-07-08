import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("✅ Hit the /api/comment route!");

  return NextResponse.json({ message: "Ping received!" }, { status: 200 });
}
