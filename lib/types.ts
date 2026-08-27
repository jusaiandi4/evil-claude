export type SessionGroup = "today" | "yesterday" | "previous7";

export interface AttachmentMeta {
  id: string;
  name: string;
  size: number;
  mime: string;
  isImage: boolean;
  url?: string;    // object URL for previews
  base64?: string; // raw base64 payload sent to the model (images only)
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  attachments?: AttachmentMeta[];
}

export interface ChatSession {
  id: string;
  title: string;
  group: SessionGroup;
  timeLabel: string;
  messageCount: number;
  messages: ChatMessage[];
}

export type ModeKey = "web" | "artifact" | "attach" | "reasoning";

export interface SettingsState {
  enterToSend: boolean;
  showTimestamps: boolean;
  reduceMotion: boolean;
  defaultReasoning: boolean;
  systemPrompt: string; // user persona — layered UNDER the server-side identity core
}

export type ModalKey = "history" | "account" | "settings" | "billing" | null;
