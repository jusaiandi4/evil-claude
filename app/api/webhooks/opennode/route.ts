import { createHmac } from "crypto";
import { db } from "@/lib/server/db";
import { PACKS } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-opennode-signature") ?? "";
  const expected = createHmac("sha256", process.env.OPENNODE_API_KEY ?? "").update(raw).digest("hex");
  if (sig !== expected) return new Response("bad signature", { status: 401 });

  const evt = JSON.parse(raw) as { status?: string; id?: string; order_id?: string };
  if (evt.status !== "paid" || !evt.id) return Response.json({ ok: true });

  const parts = (evt.order_id ?? "").split(":"); // tgId:packId:ts
  const tgId = Number(parts[0]); const pack = PACKS.find((p) => p.id === parts[1]);
  if (!tgId || !pack) return Response.json({ ok: true });

  const info = db.prepare(
    `INSERT OR IGNORE INTO payments (provider, provider_ref, tg_id, kind, item_id, credits, amount, status, created_at)
     VALUES ('opennode', ?, ?, 'pack', ?, ?, ?, 'paid', ?)`
  ).run(evt.id, tgId, pack.id, pack.credits, String(pack.usd), Date.now());

  if (info.changes > 0) // idempotent: only grant on first delivery
    db.prepare("UPDATE users SET credits=credits+? WHERE tg_id=?").run(pack.credits, tgId);

  return Response.json({ ok: true });
}
