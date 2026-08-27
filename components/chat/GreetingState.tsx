"use client";

import type { ComponentType, SVGProps } from "react";
import {
  IconCode,
  IconLayout,
  IconReasoning,
  IconSpark,
  IconZap,
} from "@/components/icons";
import { Logo } from "./Logo";
import { useChat } from "./ChatProvider";

interface Suggestion {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: IconZap,
    title: "Glowing CSS button",
    description: "Pulsing warm-amber animation, production-ready",
    prompt: "Create a glowing CSS button animation — pulsing warm-amber glow, production-ready and reduced-motion friendly.",
  },
  {
    icon: IconLayout,
    title: "SaaS landing page",
    description: "Hero, pricing, features in one artifact",
    prompt: "Build a SaaS landing page — hero, pricing and features in a single dark-themed artifact.",
  },
  {
    icon: IconCode,
    title: "Debounce function",
    description: "JavaScript utility with live demo",
    prompt: "Write a TypeScript debounce utility with a live demo I can tweak.",
  },
  {
    icon: IconReasoning,
    title: "Explain attention",
    description: "How transformer models actually work",
    prompt: "Explain how attention works in transformer models, step by step.",
  },
];

function SuggestionCard({ suggestion, onPick }: { suggestion: Suggestion; onPick: () => void }) {
  const Icon = suggestion.icon;
  return (
    <button
      onClick={onPick}
      className="group flex items-start gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-left transition duration-200 hover:border-ember-500/30 hover:bg-white/[0.045] hover:shadow-glow-sm"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-coal-800 text-ember-400 transition group-hover:border-ember-500/30">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-zinc-100">{suggestion.title}</span>
        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-zinc-500">
          {suggestion.description}
        </span>
      </span>
    </button>
  );
}

export function GreetingState() {
  const { setDraft, inputRef } = useChat();

  const pick = (prompt: string) => {
    setDraft(prompt);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(prompt.length, prompt.length);
    });
  };

  return (
    <div className="scrollbar-thin h-full overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-14 text-center">
        {/* Illuminated app icon */}
        <div className="relative mb-8">
          <div
            aria-hidden
            className="absolute -inset-8 rounded-full bg-ember-500/25 blur-3xl animate-glow-pulse"
          />
          <div
            aria-hidden
            className="absolute -inset-16 rounded-full bg-ember-600/10 blur-3xl"
          />
          <Logo className="h-[68px] w-[68px] rounded-[22px] shadow-glow" />
        </div>

        <h1 className="text-[38px] font-semibold tracking-tight text-zinc-50 sm:text-[44px]">
          What&rsquo;s on your mind?
        </h1>
        <p className="mt-3 text-[15px] text-zinc-400">
          Ask anything, or try one of these to see{" "}
          <span className="font-medium text-ember-400">Devil Reasoning</span> in action.
        </p>

        {/* 2x2 quick-action grid */}
        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <SuggestionCard key={s.title} suggestion={s} onPick={() => pick(s.prompt)} />
          ))}
        </div>
      </div>
    </div>
  );
}
