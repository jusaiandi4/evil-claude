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
  { id: "zen",   name: "Claude 3.5 Sonnet", description: "Balanced all-around chat & reasoning", vision: false, badge: "Default" },
  { id: "coder", name: "Claude Coder Pro",  description: "Deep code generation & debugging",     vision: false, badge: "Smart" },
  { id: "vision",name: "Claude Vision Pro", description: "Image understanding, OCR, UI critique",vision: true,  badge: "New" },
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

export const MOCK_SESSIONS: ChatSession[] = [
  { id: "s1", title: "Glowing CSS button animation", group: "today", timeLabel: "2m ago", messageCount: 4, messages: [] },
  {
    id: "s2", title: "SaaS landing page hero design", group: "today", timeLabel: "14m ago", messageCount: 8,
    messages: [
      { id: "s2-m1", role: "user", content: "Design a hero section for an AI dev-tools SaaS — dark theme, warm orange accent.", createdAt: "10:02" },
      { id: "s2-m2", role: "assistant", content: "Here's the concept: an oversized headline with a soft ember glow, a dual-CTA row, and a floating glass code-preview card on the right. I packed the hero, pricing and feature grid into a single artifact so you can tweak tokens live.", createdAt: "10:02" },
    ],
  },
  {
    id: "s3", title: "Debounce vs throttle in JS", group: "today", timeLabel: "1h ago", messageCount: 6,
    messages: [
      { id: "s3-m1", role: "user", content: "Debounce or throttle for a scroll-driven progress bar?", createdAt: "09:14" },
      { id: "s3-m2", role: "assistant", content: "Throttle — you want steady updates while scrolling, not a burst at the end. Debounce fits search inputs and resize handlers.", createdAt: "09:14" },
    ],
  },
  {
    id: "s4", title: "Transformer attention mechanism", group: "yesterday", timeLabel: "Tue", messageCount: 12,
    messages: [
      { id: "s4-m1", role: "user", content: "Explain transformer attention like I'm smart but sleepy.", createdAt: "Tue" },
      { id: "s4-m2", role: "assistant", content: "Attention is a learned lookup: every token asks \"who should I listen to?\" and blends the answers, weighted by relevance.", createdAt: "Tue" },
    ],
  },
  {
    id: "s5", title: "Postgres Index optimization", group: "yesterday", timeLabel: "Tue", messageCount: 9,
    messages: [
      { id: "s5-m1", role: "user", content: "My query does WHERE org_id = ? AND status = ? ORDER BY created_at DESC. What index?", createdAt: "Tue" },
      { id: "s5-m2", role: "assistant", content: "Composite: (org_id, status, created_at DESC). Equality columns first, then the sort column.", createdAt: "Tue" },
    ],
  },
  {
    id: "s6", title: "Dark mode color palette theory", group: "yesterday", timeLabel: "Tue", messageCount: 5,
    messages: [
      { id: "s6-m1", role: "user", content: "How do I build a dark-mode palette that doesn't look muddy?", createdAt: "Tue" },
      { id: "s6-m2", role: "assistant", content: "Anchor on hue, not gray: keep a single hue family, vary lightness in ~8 steps, and reserve saturation for accents.", createdAt: "Tue" },
    ],
  },
  {
    id: "s7", title: "Rust ownership explained simply", group: "previous7", timeLabel: "Mon", messageCount: 14,
    messages: [
      { id: "s7-m1", role: "user", content: "Explain Rust ownership like I write JavaScript.", createdAt: "Mon" },
      { id: "s7-m2", role: "assistant", content: "Every value has exactly one owner. Assignment moves ownership, borrows are read-only shared access.", createdAt: "Mon" },
    ],
  },
  {
    id: "s8", title: "OAuth 2.0 flow diagram", group: "previous7", timeLabel: "Sun", messageCount: 7,
    messages: [
      { id: "s8-m1", role: "user", content: "Sketch the OAuth 2.0 flow for a SPA.", createdAt: "Sun" },
      { id: "s8-m2", role: "assistant", content: "Use Authorization Code + PKCE: redirect to the IdP, receive a code, exchange it for tokens — no client secret in the browser.", createdAt: "Sun" },
    ],
  },
];
