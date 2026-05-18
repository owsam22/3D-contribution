import { GithubUser } from '../services/githubApi';

interface StatsPanelProps {
  user: GithubUser;
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-black/50 border border-green-500/15 rounded-xl p-3 flex flex-col items-center gap-1 min-w-0">
      <span className="text-lg">{icon}</span>
      <span className="text-green-100 font-bold text-base leading-none">{value}</span>
      <span className="text-green-400/60 text-[10px] text-center leading-tight">{label}</span>
    </div>
  );
}

export function StatsPanel({ user }: StatsPanelProps) {
  const contrib = user.contributionsCollection;

  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto bg-black/65 backdrop-blur-md border border-green-500/20 rounded-2xl p-4 shadow-2xl shadow-black/50">
        {/* User header */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="w-10 h-10 rounded-full border-2 border-green-500/50 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-green-500/50 bg-green-900/50 flex items-center justify-center text-lg flex-shrink-0">
              👤
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base leading-tight truncate">
              {user.name || user.login}
            </div>
            <div className="text-green-400 text-sm">@{user.login}</div>
          </div>
          {user.bio && (
            <div className="hidden md:block ml-auto text-green-300/50 text-xs max-w-xs truncate">
              {user.bio}
            </div>
          )}
          <div className="flex-shrink-0 text-right">
            <div className="text-green-300 text-xs font-medium">
              {contrib.contributionCalendar.totalContributions.toLocaleString()} total
            </div>
            <div className="text-green-400/50 text-[10px]">past year</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <StatCard
            label="Contributions"
            value={contrib.contributionCalendar.totalContributions.toLocaleString()}
            icon="⚡"
          />
          <StatCard
            label="Commits"
            value={contrib.totalCommitContributions.toLocaleString()}
            icon="💾"
          />
          <StatCard
            label="Pull Requests"
            value={contrib.totalPullRequestContributions.toLocaleString()}
            icon="🔀"
          />
          <StatCard
            label="Issues"
            value={contrib.totalIssueContributions.toLocaleString()}
            icon="🐛"
          />
          <StatCard
            label="Repos"
            value={user.repositories.totalCount.toLocaleString()}
            icon="📦"
          />
          <StatCard
            label="Followers"
            value={user.followers.totalCount.toLocaleString()}
            icon="👥"
          />
        </div>

        {/* Building type legend */}
        <div className="mt-3 pt-2 border-t border-green-500/10 flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
          <span className="text-green-400/40 text-[10px] mr-1">Building height = contributions:</span>
          {[
            { label: 'Park (0)', color: '#1a5c35' },
            { label: 'House (1–2)', color: '#9be9a8' },
            { label: 'Apartment (3–5)', color: '#40c463' },
            { label: 'Office (6–10)', color: '#30a14e' },
            { label: 'Skyscraper (11+)', color: '#216e39' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-green-300/50 text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
