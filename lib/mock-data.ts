import type { ChatSession, SessionGroup } from "./types";

export { APP_NAME } from "./branding";
export { APP_TAGLINE } from "./branding";
export const CREDITS = 480;

// ── PUBLIC catalog only. Real model names live exclusively in
//    lib/server/registry.ts and are never sent to the browser. ──
export interface AIModel {
  id: string;
  name: string;
  description: string;
  vision: boolean;
  badge?: "New" | "Fast" | "Smart" | "Default";
}

export const MODELS: AIModel[] = [
  { id: "core", name: "Evil Claude", description: "Chat, reasoning & code — the flagship engine", vision: false, badge: "Default" },
];

// ── Billing ──
export interface CreditPack {
  id: string;
  credits: number;
  stars: number; // Telegram Stars price
  usd: number;   // crypto price target
  badge?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", credits: 500,   stars: 100,  usd: 1 },
  { id: "pro",     credits: 3000,  stars: 500,  usd: 5,  badge: "Popular" },
  { id: "studio",  credits: 12000, stars: 1500, usd: 15 },
];

export const CRYPTO_WALLET = process.env.NEXT_PUBLIC_CRYPTO_WALLET ?? "";

// ── Mock account/plan — wire to real credit metering later ──
export const PLAN = {
  tier: "Pro",
  creditsTotal: 600,
  creditsUsed: 120,
  renewsOn: "Sep 24, 2026",
};

export const GROUPS: { key: SessionGroup; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "previous7", label: "Previous 7 Days" },
];

export const MOCK_SESSIONS: ChatSession[] = []; // fresh users start clean
