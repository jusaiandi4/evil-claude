"use client";

import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "./ChatProvider";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { GreetingState } from "./GreetingState";
import { MessageThread } from "./MessageThread";
import { InputBar } from "./InputBar";
import { HistoryPanel } from "./HistoryPanel";
import { AccountModal } from "./AccountModal";
import { SettingsModal } from "./SettingsModal";
import { BillingModal } from "./BillingModal";
import { Toast } from "./Toast";

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-ember-500/[0.07] blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-ember-600/[0.05] blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.025),transparent_60%)]" />
    </div>
  );
}

function Workspace() {
  const { activeSession, settings } = useChat();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setNavOpen(true);
    }
  }, []);

  const hasThread = !!activeSession && activeSession.messages.length > 0;

  return (
    <div
      className={`app-shell relative flex overflow-hidden bg-coal-950 text-zinc-200 ${
        settings.reduceMotion ? "no-motion" : ""
      }`}
    >
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <BackgroundGlow />
        <TopBar navOpen={navOpen} onToggleNav={() => setNavOpen((o) => !o)} />

        <main className="relative z-10 min-h-0 flex-1">
          {hasThread ? (
            <div key={activeSession.id} className="h-full animate-fade-up">
              <MessageThread />
            </div>
          ) : (
            <GreetingState />
          )}
        </main>

        <InputBar />
      </div>

      <HistoryPanel />
      <AccountModal />
      <SettingsModal />
      <BillingModal />
      <Toast />
    </div>
  );
}

export function ChatLayout() {
  return (
    <ChatProvider>
      <Workspace />
    </ChatProvider>
  );
}
