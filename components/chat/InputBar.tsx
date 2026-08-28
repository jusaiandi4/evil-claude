"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  IconCode,
  IconGlobe,
  IconPaperclip,
  IconReasoning,
  IconSend,
  IconX,
} from "@/components/icons";
import { cn, formatBytes, uid } from "@/lib/utils";
import type { AttachmentMeta } from "@/lib/types";
import { useChat } from "./ChatProvider";

function ModeChip({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] transition",
        active
          ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
          : "border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

const MAX_ATTACHMENTS = 8;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function InputBar() {
  const {
    draft, setDraft, sendMessage, stopGeneration, modes, toggleMode, isTyping, inputRef, settings,
  } = useChat();
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = (draft.trim().length > 0 || attachments.length > 0) && !isTyping;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft, inputRef]);

  const addFiles = async (files: File[]) => {
    const metas: AttachmentMeta[] = [];
    for (const f of files) {
      const isImage = f.type.startsWith("image/");
      metas.push({
        id: uid(),
        name: f.name,
        size: f.size,
        mime: f.type,
        isImage,
        url: isImage ? URL.createObjectURL(f) : undefined,
        base64: isImage ? await readFileAsBase64(f) : undefined, // sent to the model
      });
    }
    setAttachments((prev) => [...prev, ...metas].slice(0, MAX_ATTACHMENTS));
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const submit = () => {
    if (!canSend) return;
    void sendMessage(draft, attachments);
    setAttachments([]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const combo = settings.enterToSend
      ? e.key === "Enter" && !e.shiftKey
      : e.key === "Enter" && (e.ctrlKey || e.metaKey);
    if (combo) {
      e.preventDefault();
      submit();
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    void addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  return (
    <div className="relative z-20 px-3 pb-2 sm:px-4 sm:pb-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="rounded-[26px] border border-white/[0.07] bg-coal-850/90 px-4 pb-3 pt-3.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl transition focus-within:border-white/[0.12]">
          {attachments.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {attachments.map((a) =>
                a.isImage && a.url ? (
                  <div key={a.id} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-white/[0.1]">
                    <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.id)}
                      aria-label={`Remove ${a.name}`}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-zinc-200 opacity-0 transition hover:bg-black group-hover:opacity-100"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <span
                    key={a.id}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1 pl-2.5 pr-1 text-[12px] text-zinc-300"
                  >
                    <IconPaperclip className="h-3 w-3 shrink-0 text-ember-400" />
                    <span className="max-w-[140px] truncate">{a.name}</span>
                    <span className="shrink-0 text-zinc-600">{formatBytes(a.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.id)}
                      aria-label={`Remove ${a.name}`}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-zinc-500 transition hover:bg-white/[0.08] hover:text-zinc-200"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </span>
                ),
              )}
            </div>
          )}

          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Evil Claude..."
            className="max-h-40 w-full resize-none bg-transparent text-[15px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500"
          />

          <div className="mt-2.5 flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <ModeChip icon={IconGlobe} label="Web" active={modes.web} onClick={() => toggleMode("web")} />
              <ModeChip icon={IconCode} label="Artifact" active={modes.artifact} onClick={() => toggleMode("artifact")} />
              <ModeChip
                icon={IconReasoning}
                label="Reasoning"
                active={modes.reasoning}
                onClick={() => toggleMode("reasoning")}
              />
            </div>

            {isTyping ? (
              <button
                type="button"
                onClick={stopGeneration}
                aria-label="Stop generating"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.14] bg-white/[0.06] text-zinc-200 transition hover:bg-white/[0.12]"
              >
                <IconX className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full transition",
                  canSend
                    ? "bg-gradient-to-br from-ember-400 to-ember-600 text-white shadow-glow-sm hover:brightness-110"
                    : "bg-coal-700 text-zinc-500",
                )}
              >
                <IconSend className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2.5 text-center text-[11px] text-zinc-600">
          Evil Claude can make mistakes. Verify important information. Press{" "}
          {settings.enterToSend ? (
            <>
              <kbd className="rounded-[5px] border border-white/[0.09] bg-white/[0.05] px-1.5 py-0.5 font-sans text-[10px] text-zinc-400">
                Enter
              </kbd>{" "}
              to send.
            </>
          ) : (
            <>
              <kbd className="rounded-[5px] border border-white/[0.09] bg-white/[0.05] px-1.5 py-0.5 font-sans text-[10px] text-zinc-400">
                Ctrl
              </kbd>
              +
              <kbd className="rounded-[5px] border border-white/[0.09] bg-white/[0.05] px-1.5 py-0.5 font-sans text-[10px] text-zinc-400">
                Enter
              </kbd>{" "}
              to send.
            </>
          )}
        </p>
      </form>
    </div>
  );
}
