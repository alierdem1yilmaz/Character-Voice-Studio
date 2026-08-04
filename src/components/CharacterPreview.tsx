import type { Character } from "@/lib/types";

type Props = {
  character: Character | null;
  isGenerating: boolean;
};

export function CharacterPreview({ character, isGenerating }: Props) {
  const tags =
    character?.personality
      .split(/[,.]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5) ?? [];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-xl shadow-black/20 backdrop-blur">
      <div className="relative aspect-[4/5] w-full bg-slate-950/60">
        {character?.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
            <span className="text-4xl">
              {isGenerating ? "✨" : "🪐"}
            </span>
            <span className="text-sm">
              {isGenerating ? "Bringing your character to life..." : "Your character will appear here"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-slate-100">
          {character?.name || "No character yet"}
        </h3>
        {character && (
          <>
            <p className="text-xs text-slate-400">
              Selected Voice: <span className="text-slate-200">{character.voice}</span>
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
