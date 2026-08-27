"use client";

import type { ReactNode } from "react";
import {
  IconHistory,
  IconMenu,
  IconPanelLeft,
  IconReasoning,
  IconShare,
  IconX,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { useChat } from "./ChatProvider";
import { ModelPicker } from "./ModelPicker";

interface TopBarProps {
  navOpen: boolean;
  onToggleNav: () => void;
}

function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100"
    >
      {children}
    </button>
  );
}

export function TopBar({ navOpen, onToggleNav }: TopBarProps) {
  const { modes, toggleMode, openModal, showToast } = useChat();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Couldn't access clipboard");
    }
  };

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/[0.05] bg-coal-950/80 px-3 backdrop-blur-xl sm:px-4">
      <div className="flex min-w-0 items-center gap-1">
        {/* Mobile drawer toggle */}
        <button
          onClick={onToggleNav}
          aria-label="Toggle navigation"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100 lg:hidden"
        >
          {navOpen ? <IconX className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
        </button>
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleNav}
          aria-label="Toggle sidebar"
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100 lg:grid"
        >
          <IconPanelLeft className={cn("h-4 w-4 transition", navOpen && "opacity-60")} />
        </button>

        <ModelPicker />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {/* Devil Reasoning toggle — mirrored to the input-bar mode */}
        <button
          onClick={() => toggleMode("reasoning")}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] transition",
            modes.reasoning
              ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
              : "border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200",
          )}
        >
          <IconReasoning className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Devil Reasoning</span>
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition",
              modes.reasoning ? "bg-ember-400 shadow-glow-sm" : "bg-zinc-600",
            )}
          />
        </button>

        <IconButton label="Share chat link" onClick={handleShare}>
          <IconShare className="h-4 w-4" />
        </IconButton>
        <IconButton label="Conversation history" onClick={() => openModal("history")}>
          <IconHistory className="h-4 w-4" />
        </IconButton>
      </div>
    </header>
  );
}
