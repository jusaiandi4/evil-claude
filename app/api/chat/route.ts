import { NextRequest, NextResponse } from "next/server";
import { resolveEntry } from "@/lib/server/registry";
import { buildSystemPrompt } from "@/lib/server/core-prompt";
import { getAuth } from "@/lib/server/auth";
import { upsertUser, freeAllowance, consumeCredit, planActive } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingMessage { role: "user" | "assistant"; content: string; images?: string[]; }

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return NextResponse.json({ error: "Open through Telegram to chat." }, { status: 401 });

  let body: { modelId?: string; messages?: IncomingMessage[]; systemPrompt?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const user = upsertUser(auth);
  const hasPlan = planActive(user);

  if (hasPlan && user.credits <= 0)
    return NextResponse.json({ error: "Plan credits used up — renew or top up in Account." }, { status: 402 });
  if (!hasPlan) {
    if (freeAllowance(user) <= 0)
      return NextResponse.json({ error: "Daily free limit reached — subscribe in Account for more." }, { status: 402 });
  }

  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content, ...(m.images?.length ? { images: m.images } : {}) }));

  const hasImages = history.some((m) => m.images?.length);
  const entry = resolveEntry(body.modelId);
  if (hasImages && !entry.vision)
    return NextResponse.json({ error: "This model can't see images yet — describe it in text for now." }, { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch(`${process.env.OLLAMA_HOST ?? "http://localhost:11434"}/api/chat`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: entry.ollama, stream: true, keep_alive: -1,
        messages: [{ role: "system", content: buildSystemPrompt(entry, body.systemPrompt) }, ...history],
        options: { temperature: 0.7 },
      }),
      signal: req.signal,
    });
  } catch {
    return NextResponse.json({ error: "Model server unreachable — is Ollama running?" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return NextResponse.json({ error: `Model server error: ${detail.slice(0, 200) || upstream.status}` }, { status: 502 });
  }

  consumeCredit(user); // charged only once the model accepted the job

  const decoder = new TextDecoder(); const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, idx).trim(); buf = buf.slice(idx + 1);
            if (!line) continue;
            try {
              const json = JSON.parse(line);
              const token: string = json?.message?.content ?? "";
              if (token) controller.enqueue(encoder.encode(token));
              if (json.done) { controller.close(); return; }
            } catch { /* skip malformed line */ }
          }
        }
        controller.close();
      } catch { try { controller.close(); } catch {} }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Model": entry.publicId },
  });
}
