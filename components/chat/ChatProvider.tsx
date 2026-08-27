"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AttachmentMeta,
  ChatMessage,
  ChatSession,
  ModeKey,
  ModalKey,
  SettingsState,
} from "@/lib/types";
import { MOCK_SESSIONS, MODELS } from "@/lib/mock-data";
import { uid } from "@/lib/utils";

interface ChatContextValue {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isTyping: boolean;
  streamingId: string | null;
  modes: Record<ModeKey, boolean>;
  draft: string;
  setDraft: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  modal: ModalKey;
  openModal: (m: Exclude<ModalKey, null>) => void;
  closeModal: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  settings: SettingsState;
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  selectSession: (id: string | null) => void;
  startNewChat: () => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  toggleMode: (mode: ModeKey) => void;
  sendMessage: (content: string, attachments?: AttachmentMeta[]) => Promise<void>;
  stopGeneration: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [activeId, setActiveId] = useState<string | null>(MOCK_SESSIONS[0]?.id ?? null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [modes, setModes] = useState<Record<ModeKey, boolean>>({
    web: false,
    artifact: false,
    attach: false,
    reasoning: false,
  });
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [modal, setModal] = useState<ModalKey>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    enterToSend: true,
    showTimestamps: false,
    reduceMotion: false,
    defaultReasoning: false,
    systemPrompt: "",
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const modelRef = useRef(selectedModelId);
  modelRef.current = selectedModelId;
  const isTypingRef = useRef(false);

  // ── UI helpers ──
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const openModal = useCallback((m: Exclude<ModalKey, null>) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);

  const setSetting = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      if (key === "defaultReasoning") {
        setModes((prev) => ({ ...prev, reasoning: Boolean(value) }));
      }
    },
    [],
  );

  // ── Session actions ──
  const selectSession = useCallback((id: string | null) => setActiveId(id), []);

  const startNewChat = useCallback(() => {
    abortRef.current?.abort();
    setIsTyping(false);
    isTypingRef.current = false;
    setDraft("");
    setActiveId(null);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeIdRef.current === id) setActiveId(null);
      showToast("Conversation deleted");
    },
    [showToast],
  );

  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setActiveId(null);
    setModal(null);
    showToast("All conversations cleared");
  }, [showToast]);

  const toggleMode = useCallback((mode: ModeKey) => {
    setModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ── Messaging (streams from /api/chat → Ollama) ──
  const sendMessage = useCallback(
    async (raw: string, attachments: AttachmentMeta[] = []) => {
      const content = raw.trim();
      if ((!content && attachments.length === 0) || isTypingRef.current) return;

      const userMessage: ChatMessage = {
        id: uid(),
        role: "user",
        content: content || "(attachment)",
        createdAt: nowLabel(),
        attachments: attachments.length ? attachments : undefined,
      };
      const targetId = activeIdRef.current ?? `s-${Date.now()}`;

      // Capture history BEFORE mutating state
      const history = (sessionsRef.current.find((s) => s.id === targetId)?.messages ?? [])
        .slice(-20)
        .map((m) => ({
          role: m.role,
          content: m.content,
          images: m.attachments?.filter((a) => a.base64).map((a) => a.base64 as string),
        }));

      setSessions((prev) => {
        if (prev.some((s) => s.id === targetId)) {
          return prev.map((s) =>
            s.id === targetId
              ? { ...s, messages: [...s.messages, userMessage], messageCount: s.messageCount + 1 }
              : s,
          );
        }
        const fresh: ChatSession = {
          id: targetId,
          title: userMessage.content.length > 42 ? `${userMessage.content.slice(0, 42)}…` : userMessage.content,
          group: "today",
          timeLabel: "Just now",
          messageCount: 1,
          messages: [userMessage],
        };
        return [fresh, ...prev];
      });

      if (!activeIdRef.current) setActiveId(targetId);
      setDraft("");
      setIsTyping(true);
      isTypingRef.current = true;

      const controller = new AbortController();
      abortRef.current = controller;

      let assistantId: string | null = null;
      const appendChunk = (chunk: string) => {
        const id = assistantId;
        if (!id) {
          const newId = uid();
          assistantId = newId;
          setStreamingId(newId);
          setSessions((prev) =>
            prev.map((s) =>
              s.id === targetId
                ? {
                    ...s,
                    messages: [...s.messages, { id: newId, role: "assistant", content: chunk, createdAt: nowLabel() }],
                    messageCount: s.messageCount + 1,
                  }
                : s,
            ),
          );
        } else {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === targetId
                ? {
                    ...s,
                    messages: s.messages.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m)),
                  }
                : s,
            ),
          );
        }
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            modelId: modelRef.current,
            systemPrompt: settingsRef.current.systemPrompt,
            messages: [
              ...history,
              {
                role: "user",
                content: userMessage.content,
                images: attachments.filter((a) => a.base64).map((a) => a.base64 as string),
              },
            ],
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) appendChunk(chunk);
        }
        if (!assistantId) appendChunk("(empty response from model)");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          showToast((err as Error).message || "Model request failed");
          appendChunk("⚠️ Couldn't reach the model server. Make sure `ollama serve` is running.");
        }
      } finally {
        abortRef.current = null;
        setStreamingId(null);
        setIsTyping(false);
        isTypingRef.current = false;
      }
    },
    [showToast],
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? null,
    [sessions, activeId],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      sessions,
      activeSession,
      isTyping,
      streamingId,
      modes,
      draft,
      setDraft,
      inputRef,
      selectedModelId,
      setSelectedModelId,
      modal,
      openModal,
      closeModal,
      toast,
      showToast,
      settings,
      setSetting,
      selectSession,
      startNewChat,
      deleteSession,
      clearAllSessions,
      toggleMode,
      sendMessage,
      stopGeneration,
    }),
    [
      sessions, activeSession, isTyping, streamingId, modes, draft, selectedModelId, modal,
      toast, settings, showToast, openModal, closeModal, setSetting,
      selectSession, startNewChat, deleteSession, clearAllSessions, toggleMode,
      sendMessage, stopGeneration,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}
