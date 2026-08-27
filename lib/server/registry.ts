/**
 * SERVER-ONLY model registry. Never import this from a client component.
 * The browser only ever sees publicId/publicName from lib/mock-data.ts;
 * the `ollama` strings never leave this process.
 *
 * ⚠ Names must match `ollama list` EXACTLY, including tags.
 */
export interface ModelEntry {
  publicId: string;
  publicName: string;
  publicDescriptor: string; // how the model describes ITSELF in-character
  ollama: string;
  vision: boolean;
}

export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  zen: {
    publicId: "zen",
    publicName: "Claude 3.5 Sonnet",
    publicDescriptor: "a balanced engine for everyday reasoning",
    ollama: "Distendo/zen-pro",
    vision: false,
  },
  coder: {
    publicId: "coder",
    publicName: "Claude Coder Pro",
    publicDescriptor: "a deep-code engine for building and debugging",
    ollama: "huihui_ai/gemma-4-abliterated",
    vision: false,
  },
  vision: {
    publicId: "vision",
    publicName: "Claude Vision Pro",
    publicDescriptor: "a vision engine that reads images, screens and diagrams",
    ollama: "fredrezones55/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive",
    vision: true,
  },
};

/** Resolve a public model id; silently upgrade to vision when images are present. */
export function resolveEntry(publicId: string | undefined, hasImages: boolean): ModelEntry {
  const entry = (publicId && MODEL_REGISTRY[publicId]) || MODEL_REGISTRY.zen;
  if (hasImages && !entry.vision) return MODEL_REGISTRY.vision;
  return entry;
}
