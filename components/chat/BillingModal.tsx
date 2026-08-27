"use client";

import { useState } from "react";
import { CREDIT_PACKS, CRYPTO_WALLET } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useChat } from "./ChatProvider";
import { Modal } from "./Modal";

export function BillingModal() {
  const { modal, closeModal, showToast } = useChat();
  const open = modal === "billing";
  const [tab, setTab] = useState<"stars" | "crypto">("stars");
  const [busy, setBusy] = useState<string | null>(null);

  const buyWithStars = async (packId: string) => {
    setBusy(packId);
    try {
      const res = await fetch("/api/billing/stars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok || !data.link) throw new Error(data.error || "Couldn't create invoice");
      try {
        const { openInvoice } = await import("@telegram-apps/sdk");
        openInvoice(data.link);
      } catch {
        window.open(data.link, "_blank"); // browser fallback
      }
      showToast("Invoice opened — complete payment in Telegram");
    } catch (e) {
      showToast((e as Error).message || "Payment failed");
    } finally {
      setBusy(null);
    }
  };

  const copyWallet = async () => {
    if (!CRYPTO_WALLET) {
      showToast("Set NEXT_PUBLIC_CRYPTO_WALLET in .env.local first");
      return;
    }
    try {
      await navigator.clipboard.writeText(CRYPTO_WALLET);
      showToast("Wallet address copied");
    } catch {
      showToast("Couldn't access clipboard");
    }
  };

  return (
    <Modal open={open} onClose={closeModal} title="Top up credits" subtitle="Stars or crypto">
      {/* Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
        {(["stars", "crypto"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-9 rounded-lg text-[13px] font-medium transition",
              tab === t ? "bg-ember-500/15 text-ember-300" : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {t === "stars" ? "Telegram Stars" : "Crypto"}
          </button>
        ))}
      </div>

      {tab === "stars" ? (
        <div className="space-y-2">
          {CREDIT_PACKS.map((p) => (
            <button
              key={p.id}
              disabled={busy === p.id}
              onClick={() => buyWithStars(p.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.07] px-4 py-3.5 text-left transition hover:border-ember-500/30 hover:bg-white/[0.04] disabled:opacity-50"
            >
              <span>
                <span className="flex items-center gap-2 text-[14px] font-semibold text-zinc-100">
                  {p.credits.toLocaleString()} credits
                  {p.badge && (
                    <span className="rounded-md bg-ember-500/15 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-ember-300">
                      {p.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-zinc-500">
                  ≈ ${p.usd.toFixed(2)} paid in Stars
                </span>
              </span>
              <span className="shrink-0 rounded-lg bg-star-blue/15 px-3 py-1.5 text-[13px] font-semibold text-star-blue">
                {busy === p.id ? "…" : `⭐ ${p.stars}`}
              </span>
            </button>
          ))}
          <p className="px-1 pt-1 text-[11px] text-zinc-600">
            Opens a native Telegram invoice. Credits are granted by the payment webhook.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              USDT · TRC-20
            </p>
            <p className="mt-2 break-all font-mono text-[12.5px] leading-relaxed text-zinc-200">
              {CRYPTO_WALLET || "Set NEXT_PUBLIC_CRYPTO_WALLET in .env.local"}
            </p>
            <button
              onClick={copyWallet}
              className="mt-3 h-9 w-full rounded-lg border border-white/[0.1] text-[12.5px] font-medium text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Copy address
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.07] p-3.5">
            <p className="text-[12.5px] font-medium text-zinc-200">Rates</p>
            {CREDIT_PACKS.map((p) => (
              <p key={p.id} className="mt-1 flex justify-between text-[12px] text-zinc-500">
                <span>{p.credits.toLocaleString()} credits</span>
                <span>${p.usd.toFixed(2)} in USDT</span>
              </p>
            ))}
          </div>
          <p className="px-1 text-[11px] leading-relaxed text-zinc-600">
            Send the exact amount, then credits land after network confirmation. Manual
            verification for now — an automated chain watcher is on the roadmap.
          </p>
        </div>
      )}
    </Modal>
  );
}
