import { NextRequest, NextResponse } from "next/server";
import { SUB_PLANS } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });

  let planId: string | undefined;
  try { ({ planId } = await req.json()); } catch {}
  const plan = SUB_PLANS.find((p) => p.id === planId);
  if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });

  const res = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `Evil Claude — ${plan.name}`,
      description: `${plan.creditsPerMonth} messages / month, renews automatically`,
      payload: `sub:${plan.id}`,
      currency: "XTR",
      prices: [{ label: `${plan.name} monthly`, amount: plan.stars }],
      subscription_period: 2592000, // 30 days, auto-renews in Telegram
    }),
  });
  const data = await res.json();
  if (!data?.ok) return NextResponse.json({ error: data?.description ?? "Invoice failed" }, { status: 502 });
  return NextResponse.json({ link: data.result });
}
