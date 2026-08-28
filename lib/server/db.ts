import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";

const dir = process.env.DATA_DIR ?? process.cwd();
mkdirSync(dir, { recursive: true });
export const db = new Database(path.join(dir, "evil-claude.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  tg_id INTEGER PRIMARY KEY,
  name TEXT, username TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_expires_at INTEGER,
  free_day TEXT, free_used INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL, provider_ref TEXT NOT NULL UNIQUE,
  tg_id INTEGER NOT NULL, kind TEXT NOT NULL, item_id TEXT NOT NULL,
  credits INTEGER NOT NULL, amount TEXT, status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`);

export interface UserRow {
  tg_id: number; name: string | null; username: string | null;
  credits: number; plan: string; plan_expires_at: number | null;
  free_day: string | null; free_used: number; created_at: number;
}

export function upsertUser(a: { id: number; name?: string; username?: string }): UserRow {
  db.prepare(
    `INSERT INTO users (tg_id, name, username, created_at) VALUES (?,?,?,?)
     ON CONFLICT(tg_id) DO UPDATE SET name=COALESCE(excluded.name,name), username=COALESCE(excluded.username,username)`
  ).run(a.id, a.name ?? null, a.username ?? null, Date.now());
  return db.prepare("SELECT * FROM users WHERE tg_id=?").get(a.id) as UserRow;
}

/** Returns today's free allowance remaining (rolls over daily). */
export function freeAllowance(u: UserRow): number {
  const today = new Date().toISOString().slice(0, 10);
  if (u.free_day !== today) {
    db.prepare("UPDATE users SET free_day=?, free_used=0 WHERE tg_id=?").run(today, u.tg_id);
    return 10;
  }
  return Math.max(0, 10 - u.free_used);
}

export function consumeCredit(u: UserRow): void {
  if (u.plan !== "free" && (u.plan_expires_at ?? 0) > Date.now()) {
    db.prepare("UPDATE users SET credits=credits-1 WHERE tg_id=?").run(u.tg_id);
  } else {
    db.prepare("UPDATE users SET free_used=free_used+1 WHERE tg_id=?").run(u.tg_id);
  }
}

export function planActive(u: UserRow): boolean {
  return u.plan !== "free" && (u.plan_expires_at ?? 0) > Date.now();
}
