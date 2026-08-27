"use client";

import { useEffect, useRef, useState } from "react";
import { MODELS, type AIModel } from "@/lib/mock-data";
import { IconCheck, IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useChat } from "./ChatProvider";

const BADGE_STYLES: Record<NonNullable<AIModel["badge"]>, string> = {
  Default: "bg-white/[0.07] text-zinc-400",
  New: "bg-ember-500/15 text-ember-300",
  Fast: "bg-sky-500/15 text-sky-300",
  Smart: "bg-violet-500/15 text-violet-300",
};

function ModelBadge({ badge }: { badge: NonNullable<AIModel["badge"]> }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
        BADGE_STYLES[badge],
      )}
    >
      {badge}
    </span>
  );
}

export function ModelPicker() {
  const { selectedModelId, setSelectedModelId } = useChat();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.05]"
      >
        <Logo className="h-7 w-7 shrink-0" />
        <span className="truncate text-sm font-medium text-zinc-100">{selected.name}</span>
        <IconChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select model"
          className="absolute left-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/[0.08] bg-coal-900 shadow-2xl animate-fade-up"
        >
          <p className="px-3.5 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Models
          </p>
          <div className="scrollbar-thin max-h-80 overflow-y-auto p-1.5">
            {MODELS.map((m) => {
              const active = m.id === selected.id;
              return (
                <button
                  key={m.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedModelId(m.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    active ? "bg-ember-500/10" : "hover:bg-white/[0.05]",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-[13.5px] font-medium", active ? "text-white" : "text-zinc-200")}>
                        {m.name}
                      </span>
                      {m.badge && <ModelBadge badge={m.badge} />}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-zinc-500">
                      {m.description}
                    </span>
                  </span>
                  {active && <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />}
                </button>
              );
            })}
          </div>
          <p className="border-t border-white/[0.06] px-3.5 py-2 text-[11px] text-zinc-600">
            Powered by the Evil Claude inference stack
          </p>
        </div>
      )}
    </div>
  );
}
