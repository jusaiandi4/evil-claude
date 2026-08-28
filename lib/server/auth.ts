import { createHmac } from "crypto";

export interface TgAuth { id: number; name?: string; username?: string; }

/** Validates Telegram Mini App initData. Returns null if missing/tampered. */
export function validateInitData(raw?: string | null): TgAuth | null {
  if (!raw) return null;
  try {
    const params = new URLSearchParams(raw);
    const hash = params.get("hash");
    if (!hash) return null;
    params.delete("hash");
    const dataCheck = Array.from(params.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secret = createHmac("sha256", "WebAppData").update(process.env.TELEGRAM_BOT_TOKEN ?? "").digest();
    const computed = createHmac("sha256", secret).update(dataCheck).digest("hex");
    if (computed !== hash) return null;
    const u = JSON.parse(params.get("user") ?? "null") as
      { id: number; first_name?: string; username?: string } | null;
    return u?.id ? { id: u.id, name: u.first_name, username: u.username } : null;
  } catch {
    return null;
  }
}

/** Reads the auth header; dev-mode bypass outside production. */
export function getAuth(req: Request): TgAuth | null {
  const auth = validateInitData(req.headers.get("x-telegram-init-data"));
  if (auth) return auth;
  if (process.env.NODE_ENV !== "production") return { id: 0, name: "Dev" };
  return null;
}
