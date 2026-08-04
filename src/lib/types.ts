export const EMOTIONS = [
  "Neutral",
  "Excited",
  "Happy",
  "Sad",
  "Angry",
  "Whispering",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export const VOICES = ["Rachel", "Aria", "Sarah", "Charlotte"] as const;

export type VoiceName = (typeof VOICES)[number];

export type Character = {
  id: string;
  name: string;
  personality: string;
  appearance: string;
  voice: string;
  image_url: string | null;
  created_at: string;
};

export type VoiceGeneration = {
  id: string;
  character_id: string;
  text: string;
  emotion: string;
  audio_url: string | null;
  created_at: string;
};

export type VoiceGenerationWithCharacter = VoiceGeneration & {
  character: Pick<Character, "id" | "name" | "image_url"> | null;
};
