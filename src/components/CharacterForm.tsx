"use client";

import { VOICES, type VoiceName } from "@/lib/types";

type Props = {
  name: string;
  personality: string;
  appearance: string;
  voice: VoiceName | null;
  onNameChange: (value: string) => void;
  onPersonalityChange: (value: string) => void;
  onAppearanceChange: (value: string) => void;
  onVoiceChange: (voice: VoiceName) => void;
  onPreview: (voice: VoiceName) => void;
  previewingVoice: VoiceName | null;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
};

export function CharacterForm({
  name,
  personality,
  appearance,
  voice,
  onNameChange,
  onPersonalityChange,
  onAppearanceChange,
  onVoiceChange,
  onPreview,
  previewingVoice,
  onGenerate,
  isGenerating,
  error,
}: Props) {
  const canGenerate = name.trim() && personality.trim() && appearance.trim() && voice;

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-xl shadow-black/20 backdrop-blur">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
        <span>👤</span> Create Your Character
      </h2>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-300">Character Name</span>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Luna"
          maxLength={60}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-300">Personality</span>
        <textarea
          value={personality}
          onChange={(e) => onPersonalityChange(e.target.value)}
          placeholder="Curious, energetic, confident, and slightly sarcastic."
          rows={2}
          maxLength={200}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-300">Appearance Description</span>
        <textarea
          value={appearance}
          onChange={(e) => onAppearanceChange(e.target.value)}
          placeholder="A young space explorer with silver hair, round glasses, and a futuristic blue jacket."
          rows={3}
          maxLength={400}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>

      <div className="text-sm">
        <span className="mb-2 block text-slate-300">Voice Selection</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VOICES.map((v) => {
            const selected = voice === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onVoiceChange(v)}
                className={`relative rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                  selected
                    ? "border-indigo-400/70 bg-indigo-500/15 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20"
                }`}
              >
                {selected && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                    ✓
                  </span>
                )}
                <span className="block">🎧</span>
                {v}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={!voice || previewingVoice !== null}
          onClick={() => voice && onPreview(voice)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 py-2 text-xs font-medium text-slate-200 transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {previewingVoice ? "▶ Playing preview..." : "▶ Preview"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className="mt-auto w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isGenerating ? "Generating character..." : "✨ Generate Character"}
      </button>

      <p className="text-xs text-slate-500">
        💡 Tip: The more detailed your description, the more unique your character!
      </p>
    </section>
  );
}
