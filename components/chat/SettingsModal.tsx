"use client";

import { useEffect, useState } from "react";
import { IconTrash } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { SettingsState } from "@/lib/types";
import { useChat } from "./ChatProvider";
import { Modal } from "./Modal";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-zinc-200">{label}</span>
        <span className="mt-0.5 block text-[11.5px] leading-relaxed text-zinc-500">{description}</span>
      </span>
      <span
        className={cn(
          "mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
          checked ? "bg-ember-500" : "bg-coal-600",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
    </button>
  );
}

export function SettingsModal() {
  const { modal, closeModal, settings, setSetting, clearAllSessions, sessions } = useChat();
  const open = modal === "settings";
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  const update = <K extends keyof SettingsState>(key: K) => (v: SettingsState[K]) =>
    setSetting(key, v);

  return (
    <Modal open={open} onClose={closeModal} title="Settings" subtitle="Preferences & persona">
      <section>
        <h3 className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Chat
        </h3>
        <div className="rounded-2xl border border-white/[0.06] py-1">
          <Toggle
            checked={settings.enterToSend}
            onChange={update("enterToSend")}
            label="Enter to send"
            description="When off, use Ctrl+Enter to send and Enter for a new line."
          />
          <Toggle
            checked={settings.showTimestamps}
            onChange={update("showTimestamps")}
            label="Show timestamps"
            description="Display the time under each message bubble."
          />
          <Toggle
            checked={settings.defaultReasoning}
            onChange={update("defaultReasoning")}
            label="Devil Reasoning by default"
            description="Start every new chat with reasoning mode enabled."
          />
        </div>
      </section>

      <section className="mt-4">
        <h3 className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Persona — custom system prompt
        </h3>
        <div className="rounded-2xl border border-white/[0.06] p-3">
          <p className="px-1 pb-2 text-[11.5px] leading-relaxed text-zinc-500">
            Applied to every chat. Shape the assistant&apos;s voice, behavior and roleplay
            freely — Ember&apos;s core identity is managed server-side and can&apos;t be overridden.
          </p>
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => setSetting("systemPrompt", e.target.value)}
            rows={6}
            placeholder={"e.g. You are Captain Void — a gruff pirate senior dev. Explain everything with nautical metaphors and sign off with 'Yarr.'"}
            className="scrollbar-thin w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-[13px] leading-relaxed text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.16]"
          />
        </div>
      </section>

      <section className="mt-4">
        <h3 className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Appearance
        </h3>
        <div className="rounded-2xl border border-white/[0.06] py-1">
          <Toggle
            checked={settings.reduceMotion}
            onChange={update("reduceMotion")}
            label="Reduce motion"
            description="Disable animations and glows throughout the app."
          />
        </div>
      </section>

      <section className="mt-4">
        <h3 className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Data
        </h3>
        <div className="rounded-2xl border border-white/[0.06] p-3">
          <p className="px-1 text-[12px] text-zinc-500">
            {sessions.length} conversation{sessions.length === 1 ? "" : "s"} stored locally in this demo.
          </p>
          <button
            onClick={() => {
              if (confirming) {
                clearAllSessions();
                setConfirming(false);
              } else {
                setConfirming(true);
              }
            }}
            className={cn(
              "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-[13px] font-medium transition",
              confirming
                ? "border-red-500/50 bg-red-500/15 text-red-300"
                : "border-white/[0.08] text-zinc-400 hover:border-red-500/30 hover:text-red-300",
            )}
          >
            <IconTrash className="h-3.5 w-3.5" />
            {confirming ? "Tap again to confirm" : "Clear all conversations"}
          </button>
        </div>
      </section>
    </Modal>
  );
}
