/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { IconSpark } from "@/components/icons";
import { cn } from "@/lib/utils";
import { APP_NAME, LOGO_SRC } from "@/lib/branding";

/**
 * Brand logo. Renders public/logo.png when present; falls back to the
 * ember spark tile until you add the file — zero code changes needed.
 */
export function Logo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={LOGO_SRC}
        alt={APP_NAME}
        onError={() => setFailed(true)}
        className={cn("rounded-xl object-cover shadow-glow-sm", className)}
      />
    );
  }

  return (
    <span
      aria-label={APP_NAME}
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ember-400 to-ember-600 text-white shadow-glow-sm",
        className,
      )}
    >
      <IconSpark className="h-1/2 w-1/2" />
    </span>
  );
}
