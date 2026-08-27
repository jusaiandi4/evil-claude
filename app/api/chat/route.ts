import { NextRequest, NextResponse } from "next/server";
import { resolveEntry } from "@/lib/server/registry";
import { buildSystemPrompt } from "@/lib/server/core-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

// TODO(production): validate the x-telegram-init-data header here (HMAC-SHA256
// against TELEGRAM_BOT_TOKEN) so only real Telegram users can spend inference.

export async function POST(req: NextRequest) {
  let body: { modelId?: string; messages?: IncomingMessage[]; systemPrompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.images?.length ? { images: m.images } : {}),
    }));

  const hasImages = history.some((m) => m.images?.length);
  const entry = resolveEntry(body.modelId, hasImages); // silent vision auto-route

  const payload = {
    model: entry.ollama, // real name never leaves this process
    stream: true,
    messages: [
      { role: "system", content: buildSystemPrompt(entry, body.systemPrompt) },
      ...history,
    ],
    options: { temperature: 0.7 },
  };

  let upstream: Response;
  try {
    upstream = await fetch(`${process.env.OLLAMA_HOST ?? "http://localhost:11434"}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: req.signal, // client "stop" aborts upstream generation too
    });
  } catch {
    return NextResponse.json({ error: "Model server unreachable — is Ollama running?" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `Model server error: ${detail.slice(0, 200) || upstream.status}` },
      { status: 502 },
    );
  }

  // Ollama NDJSON → plain text token stream for the browser
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
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
            const line = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 1);
            if (!line) continue;
            try {
              const json = JSON.parse(line);
              const token: string = json?.message?.content ?? "";
              if (token) controller.enqueue(encoder.encode(token));
              if (json.done) {
                controller.close();
                return;
              }
            } catch {
              /* skip malformed line */
            }
          }
        }
        controller.close();
      } catch {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Ember-Model": entry.publicId,
    },
  });
}
