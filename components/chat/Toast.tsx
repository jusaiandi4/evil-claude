"use client";

import { useChat } from "./ChatProvider";

export function Toast() {
  const { toast } = useChat();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[80] flex justify-center px-4">
      <div className="animate-fade-up rounded-full border border-white/[0.1] bg-coal-700/95 px-4 py-2 text-[12.5px] text-zinc-100 shadow-xl backdrop-blur">
        {toast}
      </div>
    </div>
  );
}
