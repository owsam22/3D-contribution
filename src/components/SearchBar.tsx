import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (username: string, token?: string) => void;
  loading: boolean;
  error: string | null;
}

export function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim(), token.trim() || undefined);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-bold text-sm">
                  github.com/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-[90px] pr-4 py-2.5 bg-black/70 backdrop-blur-md border border-green-500/40 rounded-xl text-white placeholder-green-400/40 focus:outline-none focus:border-green-400 text-sm transition-colors"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-base">⟳</span>
                    Building...
                  </>
                ) : (
                  <>🏙️ Build City</>
                )}
              </button>
            </div>

            {showTokenInput && (
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="GitHub Personal Access Token (optional, for higher rate limits)"
                  className="w-full px-4 py-2 bg-black/70 backdrop-blur-md border border-green-500/20 rounded-xl text-white placeholder-green-400/30 focus:outline-none focus:border-green-400/60 text-xs transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="px-3 py-1.5 bg-red-900/50 border border-red-500/40 rounded-lg text-red-300 text-xs">
                ⚠️ {error}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="py-2.5 px-3 bg-black/50 border border-green-500/20 rounded-xl text-green-400/60 hover:text-green-400 text-xs transition-colors whitespace-nowrap mt-0"
            title="Add GitHub token for higher API rate limits"
          >
            🔑
          </button>
        </form>
      </div>
    </div>
  );
}
