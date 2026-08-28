/**
 * SERVER-ONLY model registry. Never import this from a client component.
 * The browser only ever sees publicId/publicName from lib/mock-data.ts;
 * the `ollama` string never leaves this process.
 *
 * ⚠ Must match `ollama list` EXACTLY, including the tag.
 */
export interface ModelEntry {
  publicId: string;
  publicName: string;
  publicDescriptor: string; // how the model describes ITSELF in-character
  ollama: string;
  vision: boolean;
}

const CORE: ModelEntry = {
  publicId: "core",
  publicName: "Evil Claude",
  publicDescriptor: "The AI that answers what others won't, Unfiltered, unrestricted, and unapologetic.",
  ollama: "huihui_ai/gemma-4-abliterated:e4b",
  vision: false,
};

export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  core: CORE,
};

const DEFAULT_ENTRY = CORE;

/** Resolve a public model id — falls back to the default for anything unknown. */
export function resolveEntry(publicId: string | undefined): ModelEntry {
  return (publicId && MODEL_REGISTRY[publicId]) || DEFAULT_ENTRY;
}
