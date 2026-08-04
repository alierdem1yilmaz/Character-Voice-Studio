import type { VoiceGenerationWithCharacter } from "@/lib/types";

type Props = {
  items: VoiceGenerationWithCharacter[];
  isLoading: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VoiceHistory({ items, isLoading }: Props) {
  return (
    <section
      id="voice-history"
      className="scroll-mt-20 rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-xl shadow-black/20 backdrop-blur"
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-100">
        <span>🕓</span> Voice History
      </h2>

      {isLoading && (
        <p className="text-sm text-slate-500">Loading history...</p>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-sm text-slate-500">
          Henüz ses kaydı yok. Bir karakter oluşturup konuşturduğunda burada görünecek.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-3 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
              {item.character?.image_url ? (
                <img
                  src={item.character.image_url}
                  alt={item.character.name}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg">
                  🎭
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-100">
                  {item.character?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
              </div>
            </div>

            <p className="min-w-0 flex-1 truncate text-sm text-slate-300" title={item.text}>
              <span className="mr-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                {item.emotion}
              </span>
              {item.text}
            </p>

            {item.audio_url && (
              <div className="flex items-center gap-2 sm:w-72 sm:shrink-0">
                <audio controls src={item.audio_url} preload="none" className="h-8 w-full" />
                <a
                  href={item.audio_url}
                  download
                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 hover:border-white/20"
                >
                  ⬇
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
