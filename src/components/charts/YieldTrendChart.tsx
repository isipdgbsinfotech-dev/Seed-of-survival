import { useState } from 'react';
import { REGIONAL_PALAY_STATS, type RegionId } from '../../data/seedsOfSurvivalData';

export type PalayMetricKey = 'averageYieldTha' | 'productionMt' | 'areaHarvestedHa';

interface YieldTrendChartProps {
  selectedRegion: 'all' | RegionId;
  yearRange: [number, number];
}

const METRIC_CONFIG: Record<
  PalayMetricKey,
  {
    label: string;
    shortLabel: string;
    unit: string;
    min: number;
    max: number;
    ticks: number[];
    formatValue: (v: number) => string;
    formatTick: (v: number) => string;
  }
> = {
  averageYieldTha: {
    label: 'Average Yield (t/ha)',
    shortLabel: 'Yield (t/ha)',
    unit: 't/ha',
    min: 3.4,
    max: 5.8,
    ticks: [3.5, 4.0, 4.5, 5.0, 5.5],
    formatValue: (v) => `${v.toFixed(2)} t/ha`,
    formatTick: (v) => v.toFixed(1),
  },
  productionMt: {
    label: 'Production (MT)',
    shortLabel: 'Production (MT)',
    unit: 'MT',
    min: 1400000,
    max: 4000000,
    ticks: [1500000, 2000000, 2500000, 3000000, 3500000, 4000000],
    formatValue: (v) => `${v.toLocaleString('en-US')} MT`,
    formatTick: (v) => `${(v / 1_000_000).toFixed(1)}M`,
  },
  areaHarvestedHa: {
    label: 'Area Harvested (ha)',
    shortLabel: 'Area (ha)',
    unit: 'ha',
    min: 440000,
    max: 740000,
    ticks: [450000, 520000, 590000, 660000, 730000],
    formatValue: (v) => `${v.toLocaleString('en-US')} ha`,
    formatTick: (v) => `${Math.round(v / 1000)}k`,
  },
};

export function YieldTrendChart({ selectedRegion, yearRange }: YieldTrendChartProps) {
  const [metric, setMetric] = useState<PalayMetricKey>('averageYieldTha');
  const [activeYear, setActiveYear] = useState<number>(2024);

  const years = [2021, 2022, 2023, 2024, 2025].filter(
    (y) => y >= yearRange[0] && y <= yearRange[1],
  );

  const cfg = METRIC_CONFIG[metric];
  const showCentralLuzon =
    selectedRegion === 'all' ||
    selectedRegion === 'central-luzon' ||
    selectedRegion === 'ilocos' ||
    selectedRegion === 'western-visayas';
  const showCagayanValley =
    selectedRegion === 'all' ||
    selectedRegion === 'cagayan-valley' ||
    selectedRegion === 'ilocos' ||
    selectedRegion === 'western-visayas';

  const clRows = years
    .map((y) => REGIONAL_PALAY_STATS.find((r) => r.regionId === 'central-luzon' && r.year === y))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const cvRows = years
    .map((y) => REGIONAL_PALAY_STATS.find((r) => r.regionId === 'cagayan-valley' && r.year === y))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const effectiveActiveYear = years.includes(activeYear) ? activeYear : years[years.length - 1] ?? 2024;
  const activeCl = clRows.find((r) => r.year === effectiveActiveYear);
  const activeCv = cvRows.find((r) => r.year === effectiveActiveYear);

  const width = 660;
  const height = 285;
  const pad = { top: 22, right: 24, bottom: 40, left: 56 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const getX = (yearIndex: number) => {
    if (years.length <= 1) return pad.left + plotW / 2;
    return pad.left + (yearIndex / (years.length - 1)) * plotW;
  };

  const getY = (val: number) => {
    const ratio = (val - cfg.min) / (cfg.max - cfg.min);
    return pad.top + plotH - ratio * plotH;
  };

  const buildPath = (rows: typeof clRows) =>
    rows
      .map((r, i) => {
        const yIndex = years.indexOf(r.year);
        return `${i === 0 ? 'M' : 'L'} ${getX(yIndex).toFixed(1)} ${getY(r[metric]).toFixed(1)}`;
      })
      .join(' ');

  const droughtStartIdx = years.indexOf(2023);
  const droughtEndIdx = years.indexOf(2024);

  const activeCondition = activeCl?.climateCondition ?? activeCv?.climateCondition ?? '';

  return (
    <section
      aria-label="Regional Palay Production and Yield Trend"
      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 h-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            Regional Palay Trajectory ({years[0]}–{years[years.length - 1]})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PSA OpenSTAT · Central Luzon (Region III) &amp; Cagayan Valley (Region II)
            {(selectedRegion === 'ilocos' || selectedRegion === 'western-visayas') &&
              ' · Showing core PSA OpenSTAT study regions'}
          </p>
        </div>

        <div
          role="group"
          aria-label="Select palay metric"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
        >
          {(Object.keys(METRIC_CONFIG) as PalayMetricKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`px-2.5 py-1.5 min-h-[32px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
                metric === key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {METRIC_CONFIG[key].shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Year Readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-tabular font-semibold text-slate-900">
            {effectiveActiveYear}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span
            className={`font-medium ${
              effectiveActiveYear === 2024
                ? 'text-red-700'
                : effectiveActiveYear === 2023
                  ? 'text-amber-700'
                  : 'text-slate-700'
            }`}
          >
            {activeCondition}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 tabular-nums">
          {showCentralLuzon && activeCl && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#14452F]" aria-hidden="true" />
              <span className="text-slate-600">Central Luzon:</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {cfg.formatValue(activeCl[metric])}
              </span>
            </div>
          )}
          {showCagayanValley && activeCv && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#B45309]" aria-hidden="true" />
              <span className="text-slate-600">Cagayan Valley:</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {cfg.formatValue(activeCv[metric])}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-auto select-none"
          role="img"
          aria-label={`Line chart showing ${cfg.label} from ${years[0]} to ${years[years.length - 1]}`}
        >
          {/* Drought highlight band (2023-2024) */}
          {droughtStartIdx !== -1 && droughtEndIdx !== -1 && (
            <g>
              <rect
                x={getX(droughtStartIdx) - 18}
                y={pad.top}
                width={getX(droughtEndIdx) - getX(droughtStartIdx) + 36}
                height={plotH}
                fill="#FEF2F2"
              />
              <text
                x={(getX(droughtStartIdx) + getX(droughtEndIdx)) / 2}
                y={pad.top + 14}
                textAnchor="middle"
                className="fill-red-700 text-[10px] font-medium"
              >
                El Niño Window (2023–2024)
              </text>
            </g>
          )}

          {/* Horizontal gridlines & Y ticks */}
          {cfg.ticks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
                <text
                  x={pad.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-500 text-[11px] font-mono-tabular"
                >
                  {cfg.formatTick(tick)}
                </text>
              </g>
            );
          })}

          {/* Active Year Vertical Guide */}
          {years.includes(effectiveActiveYear) && (
            <line
              x1={getX(years.indexOf(effectiveActiveYear))}
              y1={pad.top}
              x2={getX(years.indexOf(effectiveActiveYear))}
              y2={pad.top + plotH}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Central Luzon Line */}
          {showCentralLuzon && clRows.length > 1 && (
            <path
              d={buildPath(clRows)}
              fill="none"
              stroke="#14452F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Cagayan Valley Line */}
          {showCagayanValley && cvRows.length > 1 && (
            <path
              d={buildPath(cvRows)}
              fill="none"
              stroke="#B45309"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points & Interactive Hit Columns */}
          {years.map((year, idx) => {
            const x = getX(idx);
            const clRow = clRows.find((r) => r.year === year);
            const cvRow = cvRows.find((r) => r.year === year);
            const isSelected = year === effectiveActiveYear;

            return (
              <g
                key={year}
                className="cursor-pointer"
                onMouseEnter={() => setActiveYear(year)}
                onClick={() => setActiveYear(year)}
              >
                <rect
                  x={x - 32}
                  y={pad.top}
                  width={64}
                  height={plotH + 32}
                  fill="transparent"
                />

                {showCentralLuzon && clRow && (
                  <g>
                    <circle
                      cx={x}
                      cy={getY(clRow[metric])}
                      r={isSelected ? 5.5 : 4}
                      fill={isSelected ? '#14452F' : '#FFFFFF'}
                      stroke="#14452F"
                      strokeWidth="2.2"
                    />
                    <text
                      x={x}
                      y={getY(clRow[metric]) - 10}
                      textAnchor="middle"
                      className="fill-[#14452F] text-[10.5px] font-semibold font-mono-tabular"
                    >
                      {metric === 'averageYieldTha'
                        ? clRow.averageYieldTha.toFixed(2)
                        : cfg.formatTick(clRow[metric])}
                    </text>
                  </g>
                )}

                {showCagayanValley && cvRow && (
                  <g>
                    <circle
                      cx={x}
                      cy={getY(cvRow[metric])}
                      r={isSelected ? 5.5 : 4}
                      fill={isSelected ? '#B45309' : '#FFFFFF'}
                      stroke="#B45309"
                      strokeWidth="2.2"
                    />
                    <text
                      x={x}
                      y={getY(cvRow[metric]) + 17}
                      textAnchor="middle"
                      className="fill-[#B45309] text-[10.5px] font-semibold font-mono-tabular"
                    >
                      {metric === 'averageYieldTha'
                        ? cvRow.averageYieldTha.toFixed(2)
                        : cfg.formatTick(cvRow[metric])}
                    </text>
                  </g>
                )}

                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11.5px] font-mono-tabular ${
                    isSelected ? 'fill-slate-900 font-semibold' : 'fill-slate-500'
                  }`}
                >
                  {year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Year Buttons for keyboard & mobile tap */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
        <span>Select year to inspect climate impact:</span>
        <div className="flex items-center gap-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setActiveYear(year)}
              className={`px-2.5 py-1 rounded text-xs font-mono-tabular transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
                effectiveActiveYear === year
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
