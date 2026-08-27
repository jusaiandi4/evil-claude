import { NextRequest, NextResponse } from "next/server";
import { CREDIT_PACKS } from "@/lib/mock-data";

export const runtime = "nodejs";

/**
 * Creates a Telegram Stars invoice link via the Bot API.
 * TODO(production): set a Bot API webhook (message: successful_payment) and
 * grant credits there — `payload` below is what your webhook receives back.
 */
export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not configured" }, { status: 500 });
  }

  let packId: string | undefined;
  try {
    ({ packId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    return NextResponse.json({ error: "Unknown credit pack" }, { status: 400 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `${pack.credits.toLocaleString()} Evil Claude Credits`,
      description: "Credit pack for the Evil Claude reasoning studio",
      payload: `credits:${pack.id}:${Date.now()}`,
      currency: "XTR",
      prices: [{ label: `${pack.credits} credits`, amount: pack.stars }],
    }),
  });

  const data = await res.json();
  if (!data?.ok || !data?.result) {
    return NextResponse.json(
      { error: data?.description ?? "Bot API rejected the invoice" },
      { status: 502 },
    );
  }

  return NextResponse.json({ link: data.result });
}
