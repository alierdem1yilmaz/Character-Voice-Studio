export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg">
            🎙️
          </span>
          <span>
            <span className="block text-sm font-semibold leading-tight text-slate-100 sm:text-base">
              Character Voice Studio
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">
              Create a character and bring it to life with voice
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-1 text-sm text-slate-300 sm:gap-2">
          <a
            href="#top"
            className="rounded-lg px-2.5 py-1.5 hover:bg-white/5 hover:text-white sm:px-3"
          >
            Home
          </a>
          <a
            href="#voice-history"
            className="rounded-lg px-2.5 py-1.5 hover:bg-white/5 hover:text-white sm:px-3"
          >
            Voice History
          </a>
          <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold text-white">
            CS
          </span>
        </nav>
      </div>
    </header>
  );
}
