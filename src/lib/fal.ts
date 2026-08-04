import { fal } from "@fal-ai/client";
import type { Emotion, VoiceName } from "./types";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const credentials = process.env.FAL_KEY;
  if (!credentials) {
    throw new Error("FAL_KEY is not set. .env.local dosyasini kontrol et.");
  }
  fal.config({ credentials });
  configured = true;
}

function firstUrl(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate) return candidate;
  }
  throw new Error("fal.ai yanitinda beklenen dosya URL'i bulunamadi.");
}

export function buildCharacterImagePrompt(params: {
  name: string;
  personality: string;
  appearance: string;
}): string {
  return [
    "Create a polished character portrait.",
    `Character name: ${params.name}`,
    `Personality: ${params.personality}`,
    `Appearance: ${params.appearance}`,
    "Centered composition, expressive face, clean background, high-quality digital character illustration.",
  ].join("\n");
}

export async function generateCharacterImage(prompt: string): Promise<string> {
  ensureConfigured();
  const result = await fal.subscribe("fal-ai/flux/schnell", {
    input: { prompt, image_size: "portrait_4_3" },
    logs: false,
  });
  const data = result.data as {
    images?: Array<{ url?: string }>;
  };
  return firstUrl(data.images?.[0]?.url);
}

export function buildEmotionTaggedText(text: string, emotion: Emotion): string {
  if (emotion === "Neutral") return text;
  return `[${emotion.toLowerCase()}] ${text}`;
}

export async function generateSpeech(
  text: string,
  voice: VoiceName,
  emotion: Emotion
): Promise<string> {
  ensureConfigured();
  const taggedText = buildEmotionTaggedText(text, emotion);
  const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
    input: { text: taggedText, voice },
    logs: false,
  });
  const data = result.data as {
    audio?: { url?: string };
    audio_url?: string;
  };
  return firstUrl(data.audio?.url, data.audio_url);
}
