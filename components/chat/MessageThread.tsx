"use client";

import { useEffect, useRef } from "react";
import type { AttachmentMeta, ChatMessage } from "@/lib/types";
import { IconPaperclip, IconSpark } from "@/components/icons";
import { formatBytes } from "@/lib/utils";
import { Logo } from "./Logo";
import { useChat } from "./ChatProvider";

function AttachmentGrid({ attachments }: { attachments: AttachmentMeta[] }) {
  const images = attachments.filter((a) => a.isImage && a.url);
  const files = attachments.filter((a) => !(a.isImage && a.url));
  if (!attachments.length) return null;

  return (
    <>
      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-xl border border-white/[0.1] transition hover:border-white/[0.25]"
            >
              <img src={a.url} alt={a.name} className="h-36 w-36 object-cover" />
            </a>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {files.map((a) => (
            <span
              key={a.id}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] py-1 pl-2.5 pr-2 text-[12px] text-zinc-300"
            >
              <IconPaperclip className="h-3 w-3 text-ember-400" />
              <span className="max-w-[160px] truncate">{a.name}</span>
              <span className="text-zinc-600">{formatBytes(a.size)}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const { settings, streamingId } = useChat();
  const isStreaming = streamingId === message.id;

  return (
    <div className={`flex animate-fade-up gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Logo className="mt-0.5 h-8 w-8 shrink-0" />
      )}
      <div className={`flex max-w-[85%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        {message.attachments && message.attachments.length > 0 && (
          <AttachmentGrid attachments={message.attachments} />
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${
            isUser
              ? "rounded-br-md border border-ember-500/25 bg-ember-500/[0.12] text-zinc-100"
              : "rounded-bl-md border border-white/[0.06] bg-coal-800 text-zinc-300"
          } ${isStreaming ? "border-ember-500/20" : ""}`}
        >
          {message.content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-ember-400 align-middle" />
          )}
        </div>
        {settings.showTimestamps && (
          <span className="mt-1 text-[10px] text-zinc-600">{message.createdAt}</span>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex animate-fade-up items-center gap-3">
      <Logo className="h-8 w-8 shrink-0" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-coal-800 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-[dot-bounce_1.2s_ease-in-out_infinite] rounded-full bg-zinc-500"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function MessageThread() {
  const { activeSession, isTyping, streamingId } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, isTyping, messages[messages.length - 1]?.content]);

  return (
    <div ref={scrollRef} className="scrollbar-thin h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && !streamingId && <TypingIndicator />}
      </div>
    </div>
  );
}
