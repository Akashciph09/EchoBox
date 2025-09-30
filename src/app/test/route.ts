// app/api/test/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  return NextResponse.json({ message: "DB connection checked" });
}
