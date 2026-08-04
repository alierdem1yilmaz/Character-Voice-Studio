"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { CharacterForm } from "@/components/CharacterForm";
import { CharacterPreview } from "@/components/CharacterPreview";
import { VoiceStudio } from "@/components/VoiceStudio";
import { VoiceHistory } from "@/components/VoiceHistory";
import type {
  Character,
  Emotion,
  VoiceGeneration,
  VoiceGenerationWithCharacter,
  VoiceName,
} from "@/lib/types";

export default function Home() {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");
  const [voice, setVoice] = useState<VoiceName | null>(null);
  const [previewingVoice, setPreviewingVoice] = useState<VoiceName | null>(null);

  const [character, setCharacter] = useState<Character | null>(null);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [characterError, setCharacterError] = useState<string | null>(null);

  const [speechText, setSpeechText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("Neutral");
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [lastGeneration, setLastGeneration] = useState<VoiceGeneration | null>(null);

  const [history, setHistory] = useState<VoiceGenerationWithCharacter[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (res.ok) setHistory(data.generations);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
    fetch("/api/character")
      .then((res) => res.json())
      .then((data) => {
        if (data.character) {
          setCharacter(data.character);
          setName(data.character.name);
          setPersonality(data.character.personality);
          setAppearance(data.character.appearance);
          setVoice(data.character.voice);
        }
      })
      .catch(() => {});
  }, []);

  async function handleGenerateCharacter() {
    if (!voice) return;
    setIsGeneratingCharacter(true);
    setCharacterError(null);
    try {
      const res = await fetch("/api/character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, personality, appearance, voice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Karakter oluşturulamadı.");
      setCharacter(data.character);
      setLastGeneration(null);
    } catch (err) {
      setCharacterError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setIsGeneratingCharacter(false);
    }
  }

  async function handlePreviewVoice(v: VoiceName) {
    setPreviewingVoice(v);
    setCharacterError(null);
    try {
      const res = await fetch("/api/voice-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Önizleme alınamadı.");
      const audio = new Audio(data.audioUrl);
      audio.onended = () => setPreviewingVoice(null);
      audio.onerror = () => setPreviewingVoice(null);
      await audio.play();
    } catch (err) {
      setCharacterError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setPreviewingVoice(null);
    }
  }

  async function handleGenerateSpeech() {
    if (!character) return;
    setIsGeneratingSpeech(true);
    setSpeechError(null);
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          text: speechText,
          emotion,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ses oluşturulamadı.");
      setLastGeneration(data.generation);
      fetchHistory();
    } catch (err) {
      setSpeechError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setIsGeneratingSpeech(false);
    }
  }

  return (
    <div id="top" className="flex min-h-full flex-1 flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
          <CharacterForm
            name={name}
            personality={personality}
            appearance={appearance}
            voice={voice}
            onNameChange={setName}
            onPersonalityChange={setPersonality}
            onAppearanceChange={setAppearance}
            onVoiceChange={setVoice}
            onPreview={handlePreviewVoice}
            previewingVoice={previewingVoice}
            onGenerate={handleGenerateCharacter}
            isGenerating={isGeneratingCharacter}
            error={characterError}
          />

          <CharacterPreview character={character} isGenerating={isGeneratingCharacter} />

          <VoiceStudio
            characterName={character?.name ?? null}
            text={speechText}
            onTextChange={setSpeechText}
            emotion={emotion}
            onEmotionChange={setEmotion}
            onGenerate={handleGenerateSpeech}
            isGenerating={isGeneratingSpeech}
            error={speechError}
            result={lastGeneration}
          />
        </div>

        <VoiceHistory items={history} isLoading={historyLoading} />
      </main>

      <footer className="px-4 py-6 text-center text-xs text-slate-600 sm:px-6">
        Character Voice Studio — fal.ai (FLUX + ElevenLabs) & Supabase ile.
      </footer>
    </div>
  );
}
