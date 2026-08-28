import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/server/auth";
import { upsertUser, freeAllowance, planActive } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const u = upsertUser(auth);
  return NextResponse.json({
    credits: u.credits,
    plan: planActive(u) ? u.plan : "free",
    planExpiresAt: u.plan_expires_at,
    freeLeft: planActive(u) ? null : freeAllowance(u),
  });
}
