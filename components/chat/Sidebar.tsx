/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { GROUPS, APP_NAME, APP_TAGLINE, CREDITS } from "@/lib/mock-data";
import type { ChatSession } from "@/lib/types";
import { useTelegram } from "@/components/telegram/TelegramProvider";
import {
  IconPanelLeft,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSpark,
  IconTrash,
  IconX,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { useChat } from "./ChatProvider";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function HistoryItem({
  session,
  active,
  innerRef,
  onSelect,
  onDelete,
}: {
  session: ChatSession;
  active: boolean;
  innerRef?: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative">
      <button
        ref={innerRef}
        onClick={onSelect}
        className={cn(
          "w-full rounded-xl border px-3 py-2.5 pr-10 text-left transition",
          active
            ? "border-ember-500/25 bg-ember-500/[0.08]"
            : "border-transparent hover:bg-white/[0.04]",
        )}
      >
        <p className={cn("truncate text-[13.5px] font-medium", active ? "text-white" : "text-zinc-300")}>
          {session.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
          {session.timeLabel} · {session.messageCount} messages
        </p>
      </button>
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-ember-500"
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete "${session.title}"`}
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-zinc-600 opacity-0 transition hover:bg-white/[0.08] hover:text-red-400 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <IconTrash className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const {
    sessions,
    activeSession,
    selectSession,
    startNewChat,
    deleteSession,
    openModal,
    inputRef,
  } = useChat();
  const { user } = useTelegram();

  const [query, setQuery] = useState("");
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  // Keep the active conversation visible when switching (classic app feel).
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSession?.id, open]);

  const displayName = user
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : "Jordan Doe";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "JD";

  const q = query.trim().toLowerCase();
  const visible = q ? sessions.filter((s) => s.title.toLowerCase().includes(q)) : sessions;

  const handleNewChat = () => {
    startNewChat();
    onClose();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[286px] shrink-0 overflow-hidden transition-all duration-300 ease-out lg:static lg:z-auto",
          open
            ? "translate-x-0 lg:w-[272px]"
            : "-translate-x-full lg:w-0 lg:translate-x-0",
        )}
      >
        <div className="flex h-full w-[272px] flex-col border-r border-white/[0.05] bg-coal-900/95 backdrop-blur-xl">
          {/* Header panel */}
          <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
            <Logo className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[15px] font-semibold text-zinc-100">{APP_NAME}</p>
              <p className="truncate text-[11px] text-zinc-500">{APP_TAGLINE}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Collapse sidebar"
              className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
            >
              <IconPanelLeft className="h-4 w-4" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 pb-2">
            <button
              onClick={handleNewChat}
              className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/[0.14] hover:bg-white/[0.06]"
            >
              <IconPlus className="h-4 w-4 text-ember-400" />
              New Chat
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations"
                className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-9 pr-8 text-[13px] text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.14]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-zinc-500 transition hover:bg-white/[0.08] hover:text-zinc-200"
                >
                  <IconX className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categorized history */}
          <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-3">
            {visible.length === 0 ? (
              <p className="px-2 py-6 text-center text-[12.5px] text-zinc-600">
                {q ? `No conversations matching “${query}”` : "No conversations yet"}
              </p>
            ) : (
              GROUPS.map((group) => {
                const items = visible.filter((s) => s.group === group.key);
                if (!items.length) return null;
                return (
                  <section key={group.key} className="mb-4">
                    <h3 className="px-2 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      {group.label}
                    </h3>
                    <div className="space-y-0.5">
                      {items.map((session) => {
                        const active = activeSession?.id === session.id;
                        return (
                          <HistoryItem
                            key={session.id}
                            session={session}
                            active={active}
                            innerRef={active ? (el) => (activeItemRef.current = el) : undefined}
                            onSelect={() => {
                              selectSession(session.id);
                              onClose();
                            }}
                            onDelete={() => deleteSession(session.id)}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </nav>

          {/* Pinned user profile tile */}
          <div className="border-t border-white/[0.05] p-3">
            <div className="flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-white/[0.04]">
              <button
                onClick={() => openModal("account")}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left"
                aria-label="Open account"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/[0.08]"
                  />
                ) : (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-coal-600 to-coal-700 text-[12px] font-semibold text-zinc-300 ring-1 ring-white/[0.08]">
                    {initials}
                  </div>
                )}
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-[13.5px] font-medium text-zinc-100">
                    {displayName}
                  </span>
                  <span className="block text-[11.5px] text-zinc-500">
                    Pro · <span className="font-medium text-ember-400">{CREDITS} credits</span>
                  </span>
                </span>
              </button>
              <button
                onClick={() => openModal("settings")}
                aria-label="Open settings"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100"
              >
                <IconSettings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
