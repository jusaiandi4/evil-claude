"use client";

import { GROUPS } from "@/lib/mock-data";
import { IconHistory, IconMessage, IconPlus } from "@/components/icons";
import { useChat } from "./ChatProvider";
import { Modal } from "./Modal";

export function HistoryPanel() {
  const { sessions, modal, closeModal, selectSession, startNewChat, activeSession } = useChat();
  const open = modal === "history";

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Conversation history"
      subtitle={`${sessions.length} conversations`}
    >
      <button
        onClick={() => {
          startNewChat();
          closeModal();
        }}
        className="mb-4 flex h-11 w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/[0.14] hover:bg-white/[0.06]"
      >
        <IconPlus className="h-4 w-4 text-ember-400" />
        New chat
      </button>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <IconHistory className="h-6 w-6 text-zinc-600" />
          <p className="text-[13px] text-zinc-500">No conversations yet</p>
        </div>
      ) : (
        GROUPS.map((group) => {
          const items = sessions.filter((s) => s.group === group.key);
          if (!items.length) return null;
          return (
            <section key={group.key} className="mb-4 last:mb-0">
              <h3 className="px-1 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {group.label}
              </h3>
              <div className="space-y-1">
                {items.map((s) => {
                  const active = s.id === activeSession?.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        selectSession(s.id);
                        closeModal();
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                        active
                          ? "border-ember-500/25 bg-ember-500/[0.08]"
                          : "border-transparent hover:bg-white/[0.04]"
                      }`}
                    >
                      <IconMessage className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[13.5px] font-medium ${active ? "text-white" : "text-zinc-200"}`}>
                          {s.title}
                        </span>
                        <span className="block truncate text-[11px] text-zinc-500">
                          {s.timeLabel} · {s.messageCount} messages
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </Modal>
  );
}
