import { useMemo } from 'react';
import { CityBuilding } from '../services/githubApi';

interface HeatmapMinimapProps {
  buildings: CityBuilding[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function HeatmapMinimap({ buildings }: HeatmapMinimapProps) {
  // Organize into week/day grid
  const weeks = useMemo(() => {
    const map = new Map<number, CityBuilding[]>();
    buildings.forEach((b) => {
      if (!map.has(b.week)) map.set(b.week, []);
      map.get(b.week)!.push(b);
    });
    const result: (CityBuilding | null)[][] = [];
    const maxWeek = Math.max(...buildings.map((b) => b.week));
    for (let w = 0; w <= maxWeek; w++) {
      const weekBuildings: (CityBuilding | null)[] = [null, null, null, null, null, null, null];
      const wbs = map.get(w) || [];
      wbs.forEach((b) => {
        weekBuildings[b.day] = b;
      });
      result.push(weekBuildings);
    }
    return result;
  }, [buildings]);

  // Get month start weeks
  const monthMarkers = useMemo(() => {
    const markers: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const first = week.find((b) => b !== null);
      if (!first) return;
      const d = new Date(first.date);
      const month = d.getMonth();
      if (month !== lastMonth) {
        markers.push({ weekIdx: wi, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });
    return markers;
  }, [weeks]);

  const cellSize = 10;
  const gap = 2;

  return (
    <div className="absolute bottom-32 right-4 z-10">
      <div className="bg-black/70 backdrop-blur-md border border-green-500/20 rounded-xl p-3">
        <div className="text-green-400/60 text-[9px] uppercase tracking-wider mb-2">
          Contribution Heatmap
        </div>
        <div className="relative overflow-hidden">
          {/* Month labels */}
          <div className="flex relative mb-1 pl-5" style={{ height: '10px' }}>
            {monthMarkers.map((m) => (
              <div
                key={`${m.weekIdx}-${m.label}`}
                className="absolute text-[8px] text-green-400/50"
                style={{ left: `${20 + m.weekIdx * (cellSize + gap)}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col mr-1" style={{ gap: `${gap}px` }}>
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className="text-green-400/40 flex items-center"
                  style={{ fontSize: '7px', height: `${cellSize}px`, width: '12px' }}
                >
                  {i % 2 === 1 ? d : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: `${gap}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
                  {week.map((building, di) => (
                    <div
                      key={di}
                      title={building ? `${building.date}: ${building.count} contributions` : ''}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: building
                          ? building.color === '#ebedf0' || building.color === '#161b22'
                            ? '#161b22'
                            : building.color
                          : '#0d1117',
                        borderRadius: '2px',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 justify-end">
          <span className="text-green-400/40 text-[8px]">Less</span>
          {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((c, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{ width: '8px', height: '8px', backgroundColor: c }}
            />
          ))}
          <span className="text-green-400/40 text-[8px]">More</span>
        </div>
      </div>
    </div>
  );
}
