import { CityBuilding } from '../services/githubApi';

interface BuildingTooltipProps {
  building: CityBuilding | null;
}

const typeLabels: Record<CityBuilding['type'], string> = {
  skyscraper: '🏙️ Skyscraper',
  office: '🏢 Office Tower',
  apartment: '🏠 Apartment',
  house: '🏡 House',
  park: '🌳 Park',
};

export function BuildingTooltip({ building }: BuildingTooltipProps) {
  if (!building) return null;

  return (
    <div className="bg-black/85 backdrop-blur-md border border-green-500/30 rounded-xl px-5 py-3 text-white shadow-2xl shadow-green-900/40 min-w-[230px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{typeLabels[building.type]}</span>
      </div>
      <div className="text-xs text-green-300/80 font-mono">{building.date}</div>
      <div className="mt-2 flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm flex-shrink-0"
          style={{ backgroundColor: building.color === '#0d2318' ? '#216e39' : building.color }}
        />
        <span className="text-green-100 font-semibold text-sm">
          {building.count} contribution{building.count !== 1 ? 's' : ''}
        </span>
      </div>
      {building.count > 0 && (
        <div className="mt-1.5 h-1 bg-green-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${Math.min(building.count * 5, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
