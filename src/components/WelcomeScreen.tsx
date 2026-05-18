interface WelcomeScreenProps {
  onDemoLoad: () => void;
}

export function WelcomeScreen({ onDemoLoad }: WelcomeScreenProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#050d0a]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full gap-px">
          {Array.from({ length: 84 }).map((_, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                backgroundColor: ['#9be9a8', '#40c463', '#30a14e', '#216e39', '#ebedf0'][
                  Math.floor(Math.random() * 5)
                ],
                opacity: Math.random() > 0.5 ? 1 : 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* City silhouette */}
      <div className="relative flex items-end gap-0.5 mb-8 opacity-60">
        {[2, 4, 3, 7, 5, 9, 6, 8, 4, 6, 9, 7, 5, 3, 6, 8, 4, 7, 5, 3, 6, 4, 8, 5, 3].map((h, i) => (
          <div
            key={i}
            className="rounded-t"
            style={{
              height: `${h * 12}px`,
              width: '16px',
              backgroundColor: ['#9be9a8', '#40c463', '#30a14e', '#216e39'][Math.floor(h / 3)],
            }}
          />
        ))}
        {/* Windows glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-green-400/5 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative text-center max-w-xl">
        <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-green-400 text-xs font-semibold">🏙️ GitHub Contribution City</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
          Your commits,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            built in 3D
          </span>
        </h1>

        <p className="text-green-300/60 text-base mb-8 leading-relaxed">
          Transform your GitHub contribution history into a living, breathing 3D city.
          Every commit builds a skyscraper, every quiet day becomes a park.
          <br />
          Share it, embed it, make it yours.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          {[
            { icon: '🏗️', title: 'Interactive 3D', desc: 'Orbit & explore your city' },
            { icon: '📤', title: 'Shareable', desc: 'Share or embed anywhere' },
            { icon: '🌍', title: 'Public Profiles', desc: 'View any GitHub user' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-black/30 border border-green-500/10 rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="text-white font-semibold text-xs">{f.title}</span>
              <span className="text-green-400/50 text-xs">{f.desc}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onDemoLoad}
          className="px-6 py-3 bg-green-600/40 hover:bg-green-600/60 border border-green-500/30 rounded-xl text-green-200 font-medium text-sm transition-all hover:scale-105"
        >
          👀 Load demo city
        </button>
      </div>

      <p className="relative mt-8 text-green-400/30 text-xs">
        Type a GitHub username above to get started
      </p>
    </div>
  );
}
