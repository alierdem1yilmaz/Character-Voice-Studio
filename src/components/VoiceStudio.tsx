"use client";

import { EMOTIONS, type Emotion, type VoiceGeneration } from "@/lib/types";

const EMOTION_ICONS: Record<Emotion, string> = {
  Neutral: "😐",
  Excited: "🤩",
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Whispering: "🤫",
};

const MAX_LENGTH = 500;

type Props = {
  characterName: string | null;
  text: string;
  onTextChange: (value: string) => void;
  emotion: Emotion;
  onEmotionChange: (emotion: Emotion) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
  result: VoiceGeneration | null;
};

export function VoiceStudio({
  characterName,
  text,
  onTextChange,
  emotion,
  onEmotionChange,
  onGenerate,
  isGenerating,
  error,
  result,
}: Props) {
  const disabled = !characterName;

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-xl shadow-black/20 backdrop-blur">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
        <span>🎚️</span> Voice Studio
      </h2>

      {disabled && (
        <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
          Önce soldan bir karakter oluştur.
        </p>
      )}

      <label className="block text-sm">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-slate-300">Speech Text (English)</span>
          <span className="text-xs text-slate-500">
            {text.length}/{MAX_LENGTH}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Welcome aboard! We are about to explore a planet no human has ever visited."
          rows={3}
          disabled={disabled}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-40"
        />
      </label>

      <div className="text-sm">
        <span className="mb-2 block text-slate-300">Emotion</span>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => {
            const selected = emotion === e;
            return (
              <button
                key={e}
                type="button"
                disabled={disabled}
                onClick={() => onEmotionChange(e)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? "border-indigo-400/70 bg-indigo-500/15 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20"
                }`}
              >
                {EMOTION_ICONS[e]} {e}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || !text.trim() || isGenerating}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isGenerating ? "Generating speech..." : "🔊 Generate Speech"}
      </button>

      {result && (
        <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-100">
              {characterName}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
              {EMOTION_ICONS[result.emotion as Emotion] ?? ""} {result.emotion}
            </span>
          </div>
          <p className="mb-3 text-sm text-slate-300">{result.text}</p>
          {result.audio_url && (
            <>
              <audio
                controls
                src={result.audio_url}
                className="w-full"
                preload="none"
              />
              <div className="mt-3 flex gap-2">
                <a
                  href={result.audio_url}
                  download
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-center text-xs font-medium text-slate-200 hover:border-white/20"
                >
                  ⬇ Download
                </a>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-200 hover:border-white/20 disabled:opacity-40"
                >
                  🔁 Generate Again
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
