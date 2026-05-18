interface ControlsProps {
  theme: 'day' | 'night' | 'sunset';
  onThemeChange: (theme: 'day' | 'night' | 'sunset') => void;
  onShare: () => void;
  hasUser: boolean;
  username: string;
  year: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export function Controls({
  theme,
  onThemeChange,
  onShare,
  hasUser,
  year,
  availableYears,
  onYearChange,
}: ControlsProps) {
  return (
    <div className="absolute top-16 right-4 z-20 flex flex-col gap-2 mt-2">
      {/* Theme Selector */}
      <div className="bg-black/70 backdrop-blur-md border border-green-500/20 rounded-xl p-2 flex flex-col gap-1">
        <div className="text-green-400/50 text-[9px] text-center mb-0.5 uppercase tracking-wider">
          Theme
        </div>
        {(
          [
            { id: 'day', label: '☀️', title: 'Day' },
            { id: 'night', label: '🌙', title: 'Night' },
            { id: 'sunset', label: '🌅', title: 'Sunset' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            title={t.title}
            className={`w-9 h-9 rounded-lg text-lg transition-all ${
              theme === t.id
                ? 'bg-green-600/50 border border-green-400/50 shadow-lg shadow-green-900/30'
                : 'hover:bg-white/10 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Year Selector */}
      {availableYears.length > 1 && (
        <div className="bg-black/70 backdrop-blur-md border border-green-500/20 rounded-xl p-2 flex flex-col gap-1">
          <div className="text-green-400/50 text-[9px] text-center mb-0.5 uppercase tracking-wider">
            Year
          </div>
          {availableYears.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={`w-9 h-7 rounded-lg text-[10px] font-mono transition-all leading-none ${
                year === y
                  ? 'bg-green-600/50 border border-green-400/50 text-green-200'
                  : 'hover:bg-white/10 border border-transparent text-green-400/60'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {/* Share Button */}
      {hasUser && (
        <button
          onClick={onShare}
          className="bg-black/70 backdrop-blur-md border border-green-500/20 rounded-xl p-2 w-full flex flex-col items-center gap-0.5 hover:border-green-400/40 hover:bg-black/80 transition-all"
          title="Share your city"
        >
          <span className="text-xl">🔗</span>
          <span className="text-green-400/50 text-[9px] uppercase tracking-wider">Share</span>
        </button>
      )}

      {/* Camera controls hint */}
      <div className="bg-black/50 backdrop-blur-sm border border-green-500/10 rounded-xl p-2 text-center">
        <div className="text-green-400/35 text-[8px] leading-relaxed space-y-0.5">
          <div>🖱️ Drag to orbit</div>
          <div>⚙️ Scroll to zoom</div>
          <div>✋ Right-drag pan</div>
        </div>
      </div>
    </div>
  );
}
