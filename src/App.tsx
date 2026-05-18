import { useState, useEffect, useCallback } from 'react';
import { CityScene } from './components/CityScene';
import { SearchBar } from './components/SearchBar';
import { StatsPanel } from './components/StatsPanel';
import { BuildingTooltip } from './components/BuildingTooltip';
import { SharePanel } from './components/SharePanel';
import { Controls } from './components/Controls';
import { LoadingScreen } from './components/LoadingScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HeatmapMinimap } from './components/HeatmapMinimap';
import {
  fetchGithubUser,
  contributionsToCityData,
  generateDemoData,
  type GithubUser,
  type CityBuilding,
} from './services/githubApi';

type Theme = 'day' | 'night' | 'sunset';

// Get list of years from account creation up to now
function getAvailableYears(createdYear = 2020): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= Math.max(createdYear, currentYear - 5); y--) {
    years.push(y);
  }
  return years;
}

export default function App() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [buildings, setBuildings] = useState<CityBuilding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<CityBuilding | null>(null);
  const [theme, setTheme] = useState<Theme>('night');
  const [showShare, setShowShare] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentToken, setCurrentToken] = useState<string | undefined>(undefined);
  const [isDemo, setIsDemo] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears] = useState<number[]>(getAvailableYears(2015));

  const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get('user');
    const urlYear = params.get('year');

    if (urlYear) {
      const y = parseInt(urlYear, 10);
      if (!isNaN(y)) setSelectedYear(y);
    }

    if (urlUser) {
      setShowWelcome(false);
      handleSearch(urlUser, undefined, urlYear ? parseInt(urlYear, 10) : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    async (username: string, token?: string, year?: number) => {
      setLoading(true);
      setError(null);
      setIsDemo(false);
      setShowWelcome(false);

      const effectiveYear = year ?? selectedYear;
      const isCurrentYear = effectiveYear === new Date().getFullYear();

      try {
        const userData = await fetchGithubUser(
          username,
          token,
          isCurrentYear ? undefined : effectiveYear
        );
        const cityData = contributionsToCityData(userData);
        setUser(userData);
        setBuildings(cityData);
        setCurrentUsername(username);
        setCurrentToken(token);

        // Update URL
        const url = new URL(window.location.href);
        url.searchParams.set('user', username);
        if (!isCurrentYear) url.searchParams.set('year', String(effectiveYear));
        else url.searchParams.delete('year');
        window.history.pushState({}, '', url.toString());
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (message.includes('401') || message.includes('Bad credentials')) {
          setError('Invalid GitHub token. For public profiles, leave the token empty.');
        } else if (message.includes('not found') || message.includes('Could not resolve')) {
          setError(`User "${username}" not found on GitHub.`);
        } else if (message.includes('rate limit') || message.includes('403')) {
          setError('GitHub API rate limit reached. Add a personal access token (🔑) to continue.');
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedYear]
  );

  const handleYearChange = useCallback(
    (year: number) => {
      setSelectedYear(year);
      if (currentUsername && !isDemo) {
        handleSearch(currentUsername, currentToken, year);
      }
    },
    [currentUsername, currentToken, isDemo, handleSearch]
  );

  const handleDemoLoad = useCallback(() => {
    const demoData = generateDemoData();
    setUser(demoData);
    setBuildings(contributionsToCityData(demoData));
    setIsDemo(true);
    setShowWelcome(false);
    setCurrentUsername('demo-user');
  }, []);

  const handleBuildingHover = useCallback((building: CityBuilding | null) => {
    setHoveredBuilding(building);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#050d0a] overflow-hidden relative font-sans select-none">
      {/* 3D City Canvas */}
      {user && !loading && (
        <div className="absolute inset-0">
          <CityScene
            buildings={buildings}
            theme={theme}
            onBuildingHover={handleBuildingHover}
          />
        </div>
      )}

      {/* Loading overlay */}
      {loading && <LoadingScreen username={currentUsername || 'your'} />}

      {/* Welcome screen */}
      {showWelcome && !loading && !user && (
        <WelcomeScreen onDemoLoad={handleDemoLoad} />
      )}

      {/* ── Top gradient ── */}
      {!isEmbed && (
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* ── Header + Search ── */}
      {!isEmbed && (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3">
          {/* Brand row */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/35 flex items-center justify-center">
                <span className="text-sm leading-none">🏙️</span>
              </div>
              <h1 className="text-white font-extrabold text-lg tracking-tight leading-none">
                Git<span className="text-green-400">City</span>
              </h1>
            </div>

            {isDemo && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5 font-medium">
                Demo
              </span>
            )}
            {user && !isDemo && (
              <span className="text-[10px] bg-green-500/15 text-green-300 border border-green-500/25 rounded-full px-2 py-0.5 font-medium">
                @{currentUsername} · {selectedYear}
              </span>
            )}
          </div>

          <SearchBar onSearch={handleSearch} loading={loading} error={error} />
        </div>
      )}

      {/* ── Building hover tooltip ── */}
      {user && hoveredBuilding && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <BuildingTooltip building={hoveredBuilding} />
        </div>
      )}

      {/* ── Side controls ── */}
      {user && !isEmbed && (
        <Controls
          theme={theme}
          onThemeChange={setTheme}
          onShare={() => setShowShare(true)}
          hasUser={!!user && !isDemo}
          username={currentUsername}
          year={selectedYear}
          availableYears={availableYears}
          onYearChange={handleYearChange}
        />
      )}

      {/* ── Minimap toggle ── */}
      {user && !isEmbed && (
        <>
          <button
            onClick={() => setShowMinimap((v) => !v)}
            className="absolute z-20 right-4 bottom-32 text-[10px] text-green-400/50 hover:text-green-400 transition-colors bg-black/60 border border-green-500/15 rounded-lg px-2 py-1"
            style={{ bottom: showMinimap ? 'calc(8rem + 160px)' : '8.5rem' }}
          >
            {showMinimap ? '🗺️ Hide Map' : '🗺️ Map'}
          </button>
          {showMinimap && (
            <div
              className="absolute right-4 z-10"
              style={{ bottom: '8.5rem' }}
            >
              <HeatmapMinimap buildings={buildings} />
            </div>
          )}
        </>
      )}

      {/* ── Bottom gradient ── */}
      {user && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>
      )}

      {/* ── Stats panel ── */}
      {user && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <StatsPanel user={user} />
        </div>
      )}

      {/* ── Share modal ── */}
      {showShare && currentUsername && (
        <SharePanel username={currentUsername} onClose={() => setShowShare(false)} />
      )}

      {/* ── Embed watermark ── */}
      {isEmbed && user && (
        <a
          href={`${window.location.origin}${window.location.pathname}?user=${currentUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 bg-black/70 border border-green-500/25 rounded-lg px-2.5 py-1.5 text-green-400/70 text-xs hover:text-green-400 transition-colors no-underline"
        >
          🏙️ <span className="font-bold">GitCity</span>
        </a>
      )}

      {/* ── Embed search (when no user set) ── */}
      {isEmbed && !user && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#050d0a]">
          <div className="text-center px-6">
            <div className="text-white text-xl font-bold mb-1">🏙️ GitCity</div>
            <div className="text-green-400/50 text-sm mb-6">Enter a GitHub username to build your city</div>
            <SearchBar onSearch={handleSearch} loading={loading} error={error} />
          </div>
        </div>
      )}
    </div>
  );
}
