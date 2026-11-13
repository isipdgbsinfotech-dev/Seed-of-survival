import { useState } from 'react';
import { SEED_PERFORMANCE_DATA, type SeedPerformanceRow } from '../../data/seedsOfSurvivalData';
import { compareSeedAgainstTraditional } from '../../utils/analytics';

type ChartMode = 'rainfed-vs-peak' | 'maturity-scatter';

export function SeedComparisonChart() {
  const [mode, setMode] = useState<ChartMode>('rainfed-vs-peak');
  const [selectedSeedId, setSelectedSeedId] = useState<string>('nsic-rc480');

  const sortedForBar = [...SEED_PERFORMANCE_DATA].sort(
    (a, b) => b.avgRainfedHarvestTha - a.avgRainfedHarvestTha,
  );

  const selectedSeed =
    SEED_PERFORMANCE_DATA.find((s) => s.id === selectedSeedId) ?? SEED_PERFORMANCE_DATA[0];
  const comparison = compareSeedAgainstTraditional(selectedSeed.id, 1, SEED_PERFORMANCE_DATA);

  return (
    <section
      aria-label="DA-PhilRice Seed Performance Comparison"
      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            Drought-Tolerant Seed Performance vs. Traditional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            DA-PhilRice · Rainfed average (3.43 t/ha PhilRice mean vs. 2.10 t/ha traditional) &amp; maturity window
          </p>
        </div>

        <div
          role="group"
          aria-label="Select seed chart mode"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
        >
          <button
            type="button"
            onClick={() => setMode('rainfed-vs-peak')}
            className={`px-2.5 py-1.5 min-h-[32px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
              mode === 'rainfed-vs-peak'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yield Comparison
          </button>
          <button
            type="button"
            onClick={() => setMode('maturity-scatter')}
            className={`px-2.5 py-1.5 min-h-[32px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
              mode === 'maturity-scatter'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Days vs. Yield
          </button>
        </div>
      </div>

      {mode === 'rainfed-vs-peak' ? (
        <RainfedBarChart
          rows={sortedForBar}
          selectedSeedId={selectedSeed.id}
          onSelectSeed={setSelectedSeedId}
        />
      ) : (
        <MaturityScatterChart
          rows={SEED_PERFORMANCE_DATA}
          selectedSeedId={selectedSeed.id}
          onSelectSeed={setSelectedSeedId}
        />
      )}

      {/* Selected Seed Inspector Strip */}
      {comparison && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="col-span-2 sm:col-span-1">
            <div className="text-slate-500">Selected Variety</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {selectedSeed.seedCode} ({selectedSeed.seedName})
            </div>
          </div>
          <div>
            <div className="text-slate-500">Rainfed Harvest</div>
            <div className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
              {selectedSeed.avgRainfedHarvestTha.toFixed(2)} t/ha
            </div>
          </div>
          <div>
            <div className="text-slate-500">Peak Potential</div>
            <div className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
              {selectedSeed.highestPossibleHarvestTha.toFixed(2)} t/ha
            </div>
          </div>
          <div>
            <div className="text-slate-500">Maturity</div>
            <div className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
              {selectedSeed.daysToHarvest} days
              {!selectedSeed.isTraditional && (
                <span className="text-[#14452F] ml-1">(-{comparison.daysSaved}d)</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Vs. Traditional</div>
            <div className="font-mono-tabular font-semibold text-[#14452F] mt-0.5">
              {selectedSeed.isTraditional
                ? 'Baseline (2.10 t/ha)'
                : `+${comparison.yieldDeltaTha.toFixed(2)} t/ha (+${comparison.yieldGainPercent}%)`}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function RainfedBarChart({
  rows,
  selectedSeedId,
  onSelectSeed,
}: {
  rows: SeedPerformanceRow[];
  selectedSeedId: string;
  onSelectSeed: (id: string) => void;
}) {
  const maxYield = 9.2;
  const width = 760;
  const rowH = 38;
  const pad = { top: 26, right: 64, bottom: 26, left: 142 };
  const height = pad.top + rows.length * rowH + pad.bottom;
  const plotW = width - pad.left - pad.right;

  const getX = (val: number) => pad.left + (val / maxYield) * plotW;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[540px] h-auto select-none"
        role="img"
        aria-label="Horizontal bar chart comparing rainfed harvest and peak harvest across rice varieties"
      >
        {/* Reference lines */}
        <g>
          <line
            x1={getX(2.1)}
            y1={pad.top - 6}
            x2={getX(2.1)}
            y2={height - pad.bottom}
            stroke="#DC2626"
            strokeDasharray="3 3"
          />
          <text
            x={getX(2.1)}
            y={14}
            textAnchor="middle"
            className="fill-red-700 text-[10px] font-medium font-mono-tabular"
          >
            Traditional 2.10
          </text>

          <line
            x1={getX(3.43)}
            y1={pad.top - 6}
            x2={getX(3.43)}
            y2={height - pad.bottom}
            stroke="#14452F"
            strokeDasharray="3 3"
          />
          <text
            x={getX(3.43)}
            y={14}
            textAnchor="middle"
            className="fill-[#14452F] text-[10px] font-medium font-mono-tabular"
          >
            PhilRice Mean 3.43
          </text>
        </g>

        {/* X ticks */}
        {[0, 2, 4, 6, 8].map((tick) => (
          <g key={tick}>
            <line
              x1={getX(tick)}
              y1={pad.top}
              x2={getX(tick)}
              y2={height - pad.bottom}
              stroke="#F1F5F9"
            />
            <text
              x={getX(tick)}
              y={height - 8}
              textAnchor="middle"
              className="fill-slate-400 text-[10.5px] font-mono-tabular"
            >
              {tick} t/ha
            </text>
          </g>
        ))}

        {rows.map((row, idx) => {
          const y = pad.top + idx * rowH;
          const isSelected = row.id === selectedSeedId;
          const avgW = Math.max(4, getX(row.avgRainfedHarvestTha) - pad.left);
          const peakW = Math.max(4, getX(row.highestPossibleHarvestTha) - pad.left);

          return (
            <g
              key={row.id}
              className="cursor-pointer"
              onClick={() => onSelectSeed(row.id)}
            >
              <rect
                x={0}
                y={y + 1}
                width={width}
                height={rowH - 2}
                rx={4}
                fill={isSelected ? '#F0FDF4' : 'transparent'}
              />
              <text
                x={pad.left - 12}
                y={y + 22}
                textAnchor="end"
                className={`text-[11.5px] ${
                  isSelected ? 'fill-[#14452F] font-semibold' : 'fill-slate-700 font-medium'
                }`}
              >
                {row.seedCode}
              </text>

              {/* Highest possible bar (background) */}
              <rect
                x={pad.left}
                y={y + 8}
                width={peakW}
                height={20}
                rx={3}
                fill={row.isTraditional ? '#E2E8F0' : '#BBF7D0'}
              />

              {/* Average rainfed bar (foreground) */}
              <rect
                x={pad.left}
                y={y + 8}
                width={avgW}
                height={20}
                rx={3}
                fill={row.isTraditional ? '#64748B' : '#14452F'}
              />

              <text
                x={pad.left + peakW + 8}
                y={y + 22}
                className="fill-slate-700 text-[11px] font-mono-tabular"
              >
                {row.avgRainfedHarvestTha.toFixed(2)} / {row.highestPossibleHarvestTha.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-600 mt-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-xs bg-[#14452F]" aria-hidden="true" />
          Avg Rainfed Harvest (t/ha)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-xs bg-[#BBF7D0]" aria-hidden="true" />
          Highest Possible Harvest (t/ha)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-xs bg-[#64748B]" aria-hidden="true" />
          Traditional Baseline
        </span>
      </div>
    </div>
  );
}

function MaturityScatterChart({
  rows,
  selectedSeedId,
  onSelectSeed,
}: {
  rows: SeedPerformanceRow[];
  selectedSeedId: string;
  onSelectSeed: (id: string) => void;
}) {
  const width = 760;
  const height = 285;
  const pad = { top: 34, right: 32, bottom: 40, left: 56 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const minDays = 103;
  const maxDays = 128;
  const minYield = 1.7;
  const maxYield = 4.25;

  const getX = (days: number) => pad.left + ((days - minDays) / (maxDays - minDays)) * plotW;
  const getY = (yld: number) => pad.top + plotH - ((yld - minYield) / (maxYield - minYield)) * plotH;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[520px] h-auto select-none"
        role="img"
        aria-label="Scatter plot of days to harvest versus average rainfed harvest"
      >
        {/* Fast-maturity sweet spot zone (106-110 days, >= 3.2 t/ha) */}
        <rect
          x={getX(105)}
          y={getY(4.05)}
          width={getX(111) - getX(105)}
          height={getY(3.15) - getY(4.05)}
          rx={6}
          fill="#ECFDF5"
          stroke="#A7F3D0"
          strokeDasharray="3 3"
        />
        <text
          x={(getX(105) + getX(111)) / 2}
          y={getY(4.05) - 8}
          textAnchor="middle"
          className="fill-[#14452F] text-[10.5px] font-semibold"
        >
          Early Maturity Zone (106–110d)
        </text>

        {/* Gridlines */}
        {[2.0, 2.5, 3.0, 3.5, 4.0].map((yTick) => (
          <g key={yTick}>
            <line
              x1={pad.left}
              y1={getY(yTick)}
              x2={width - pad.right}
              y2={getY(yTick)}
              stroke="#E2E8F0"
              strokeDasharray="3 3"
            />
            <text
              x={pad.left - 10}
              y={getY(yTick) + 3.5}
              textAnchor="end"
              className="fill-slate-500 text-[10.5px] font-mono-tabular"
            >
              {yTick.toFixed(1)}
            </text>
          </g>
        ))}

        {[105, 110, 115, 120, 125].map((xTick) => (
          <g key={xTick}>
            <line
              x1={getX(xTick)}
              y1={pad.top}
              x2={getX(xTick)}
              y2={height - pad.bottom}
              stroke="#F1F5F9"
            />
            <text
              x={getX(xTick)}
              y={height - 12}
              textAnchor="middle"
              className="fill-slate-500 text-[10.5px] font-mono-tabular"
            >
              {xTick}d
            </text>
          </g>
        ))}

        {rows.map((row) => {
          const cx = getX(row.daysToHarvest);
          const cy = getY(row.avgRainfedHarvestTha);
          const isSelected = row.id === selectedSeedId;
          const color = row.isTraditional
            ? '#DC2626'
            : row.droughtTolerance === 'High'
              ? '#14452F'
              : '#D97706';

          const labelYOffset = row.id === 'nsic-rc192' ? 18 : -11;

          return (
            <g
              key={row.id}
              className="cursor-pointer"
              onClick={() => onSelectSeed(row.id)}
            >
              {isSelected && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill={color}
                  fillOpacity={0.14}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 7 : 5.5}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy + labelYOffset}
                textAnchor={row.isTraditional ? 'end' : 'middle'}
                className="fill-slate-800 text-[10.5px] font-medium"
              >
                {row.seedCode}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-600 mt-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#14452F]" aria-hidden="true" />
          High Drought Tolerance
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D97706]" aria-hidden="true" />
          Moderate / Moderate-High
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DC2626]" aria-hidden="true" />
          Low (Traditional)
        </span>
      </div>
    </div>
  );
}
