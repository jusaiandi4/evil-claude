import { NextRequest, NextResponse } from "next/server";
import { PACKS } from "@/lib/plans";
import { getAuth } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let packId: string | undefined;
  try { ({ packId } = await req.json()); } catch {}
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) return NextResponse.json({ error: "Unknown pack" }, { status: 400 });

  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const res = await fetch("https://api.opennode.com/v1/charges", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: process.env.OPENNODE_API_KEY ?? "" },
    body: JSON.stringify({
      amount: pack.usd, currency: "USD",
      description: `${pack.credits} Evil Claude credits`,
      order_id: `${auth.id}:${pack.id}:${Date.now()}`,
      callback_url: `${base}/api/webhooks/opennode`,
      success_url: base, auto_settle: false,
    }),
  });
  const data = await res.json();
  const url = data?.data?.hosted_checkout_url;
  if (!url) return NextResponse.json({ error: data?.message ?? "OpenNode charge failed" }, { status: 502 });
  return NextResponse.json({ url });
}
