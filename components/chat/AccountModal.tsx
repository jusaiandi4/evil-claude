/* eslint-disable @next/next/no-img-element */
"use client";

import { PLAN } from "@/lib/mock-data";
import { IconCreditCard } from "@/components/icons";
import { useTelegram } from "@/components/telegram/TelegramProvider";
import { useChat } from "./ChatProvider";
import { Modal } from "./Modal";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.03]">
      <span className="text-[12.5px] text-zinc-500">{label}</span>
      <span className="truncate text-[13px] font-medium text-zinc-200">{value}</span>
    </div>
  );
}

export function AccountModal() {
  const { modal, closeModal, openModal, showToast } = useChat();
  const { user, platform, isTelegram } = useTelegram();
  const open = modal === "account";

  const displayName = user ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Jordan Doe";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "JD";

  const creditsLeft = PLAN.creditsTotal - PLAN.creditsUsed;
  const usedPct = Math.round((PLAN.creditsUsed / PLAN.creditsTotal) * 100);

  return (
    <Modal open={open} onClose={closeModal} title="Account" subtitle="Profile & plan">
      <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        {user?.photoUrl ? (
          <img src={user.photoUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/[0.1]" />
        ) : (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-coal-600 to-coal-700 text-[15px] font-semibold text-zinc-300 ring-1 ring-white/[0.1]">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-zinc-100">{displayName}</p>
          <p className="truncate text-[12px] text-zinc-500">
            {user?.username ? `@${user.username}` : isTelegram ? `Telegram · ${platform}` : "Demo profile (browser mode)"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] font-semibold text-zinc-100">{PLAN.tier} plan</p>
          <span className="rounded-md bg-ember-500/15 px-2 py-0.5 text-[11px] font-medium text-ember-300">
            {creditsLeft} credits left
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-coal-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-400"
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500">
          <span>{PLAN.creditsUsed} used this cycle</span>
          <span>of {PLAN.creditsTotal}</span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">Renews on {PLAN.renewsOn}</p>
      </div>

      <div className="mt-4">
        <h3 className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Details
        </h3>
        <div className="rounded-2xl border border-white/[0.06] py-1">
          <InfoRow label="Platform" value={platform} />
          {user && <InfoRow label="User ID" value={String(user.id)} />}
          <InfoRow label="Premium" value={user?.isPremium ? "Yes" : "No"} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            closeModal();
            openModal("billing");
          }}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-ember-400 to-ember-600 text-sm font-semibold text-white shadow-glow-sm transition hover:brightness-110"
        >
          <IconCreditCard className="h-4 w-4" />
          Top up credits
        </button>
        <button
          onClick={() => showToast("Demo build — billing portal not wired yet")}
          className="flex h-11 items-center justify-center rounded-xl border border-white/[0.08] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
        >
          Manage subscription
        </button>
      </div>
    </Modal>
  );
}
