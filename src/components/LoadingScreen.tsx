import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  username: string;
}

const messages = [
  'Fetching contributions...',
  'Analyzing activity patterns...',
  'Laying city foundations...',
  'Constructing buildings...',
  'Adding city lights...',
  'Polishing skyscrapers...',
];

export function LoadingScreen({ username }: LoadingScreenProps) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050d0a]">
      {/* Animated city silhouette */}
      <div className="relative flex items-end gap-1 mb-10 h-24">
        {[3, 5, 4, 8, 6, 9, 7, 5, 4, 6, 8, 5, 3, 7, 4].map((h, i) => (
          <div
            key={i}
            className="bg-green-500/40 rounded-t-sm animate-pulse"
            style={{
              height: `${h * 10}px`,
              width: '14px',
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.8 + (i % 3) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Building <span className="text-green-400">@{username}</span>'s City
        </h2>
        <p className="text-green-400/60 text-sm animate-pulse">{messages[msgIdx]}</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-green-900/50 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full animate-progress" />
      </div>
    </div>
  );
}
