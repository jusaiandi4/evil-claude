"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  init,
  miniApp,
  swipeBehavior,
  themeParams,
  viewport,
  retrieveLaunchParams,
} from "@telegram-apps/sdk";

export interface TelegramProfile {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isPremium?: boolean;
}

export interface TelegramTheme {
  bgColor?: string;
  textColor?: string;
  hintColor?: string;
  linkColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  secondaryBgColor?: string;
}

interface TelegramContextValue {
  isReady: boolean;
  isTelegram: boolean;
  platform: string;
  user: TelegramProfile | null;
  theme: TelegramTheme | null;
  colorScheme: "light" | "dark";
}

const BRAND_BG = "#0b0c10";

const DEFAULT_VALUE: TelegramContextValue = {
  isReady: false,
  isTelegram: false,
  platform: "unknown",
  user: null,
  theme: null,
  colorScheme: "dark",
};

const TelegramContext = createContext<TelegramContextValue>(DEFAULT_VALUE);

function luminance(hex?: string): number {
  if (!hex) return 0;
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const n = parseInt(c.slice(0, 6), 16);
  if (Number.isNaN(n)) return 0;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function pickTheme(raw: Record<string, string | undefined>): TelegramTheme {
  return {
    bgColor: raw.bg_color ?? raw.bgColor,
    textColor: raw.text_color ?? raw.textColor,
    hintColor: raw.hint_color ?? raw.hintColor,
    linkColor: raw.link_color ?? raw.linkColor,
    buttonColor: raw.button_color ?? raw.buttonColor,
    buttonTextColor: raw.button_text_color ?? raw.buttonTextColor,
    secondaryBgColor: raw.secondary_bg_color ?? raw.secondaryBgColor,
  };
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<TelegramContextValue>(DEFAULT_VALUE);

  useEffect(() => {
    try {
      init();
    } catch {
      /* running outside Telegram */
    }

    try {
      viewport.expand();
    } catch {}
    try {
      viewport.bindCssVars();
      miniApp.bindCssVars();
      themeParams.bindCssVars();
    } catch {}
    try {
      miniApp.setHeaderColor(BRAND_BG);
      miniApp.setBackgroundColor(BRAND_BG);
    } catch {}
    try {
      miniApp.ready();
    } catch {}
    try {
      swipeBehavior.disableVertical();
    } catch {}

    try {
      const lp = retrieveLaunchParams();
      const tgUser = lp.initData?.user;
      const theme = pickTheme((lp.themeParams ?? {}) as Record<string, string | undefined>);
      setValue({
        isReady: true,
        isTelegram: true,
        platform: lp.platform,
        user: tgUser
          ? {
              id: tgUser.id,
              firstName: tgUser.first_name,
              lastName: tgUser.last_name,
              username: tgUser.username,
              photoUrl: tgUser.photo_url,
              isPremium: tgUser.is_premium,
            }
          : null,
        theme,
        colorScheme: luminance(theme.bgColor) > 0.5 ? "light" : "dark",
      });
    } catch {
      setValue((prev) => ({ ...prev, isReady: true }));
    }
  }, []);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram(): TelegramContextValue {
  return useContext(TelegramContext);
}
