import { NextResponse } from "next/server";
import { onAuthenticate } from "@/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // Forward to the page.tsx for actual handling
  return NextResponse.next();
}

export async function POST(request) {
  // Forward to the page.tsx for actual handling
  return NextResponse.next();
}
