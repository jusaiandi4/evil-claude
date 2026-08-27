"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { IconX } from "@/components/icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom-sheet on mobile (Telegram-native), centered dialog on desktop. */
export function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/[0.08] bg-coal-900 shadow-2xl animate-fade-up sm:max-w-md sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 pb-4 pt-5">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-zinc-100">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-zinc-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="border-t border-white/[0.06] px-5 py-3.5">{footer}</div>
        )}
      </div>
    </div>
  );
}
