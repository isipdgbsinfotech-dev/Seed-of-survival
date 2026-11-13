import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import {
  SEED_PERFORMANCE_DATA,
  type DroughtToleranceLevel,
  type GrowingAreaType,
  type SeedPerformanceRow,
} from '../../data/seedsOfSurvivalData';
import {
  compareSeedAgainstTraditional,
  computePhilRiceAverageRainfedYield,
  filterSeedPerformance,
  sortByKey,
  type SortDirection,
} from '../../utils/analytics';
import { SeedComparisonChart } from '../charts/SeedComparisonChart';

interface SeedPerformanceViewProps {
  toleranceFilter: 'all' | DroughtToleranceLevel;
  onChangeToleranceFilter: (tolerance: 'all' | DroughtToleranceLevel) => void;
  areaFilter: 'all' | GrowingAreaType;
  onChangeAreaFilter: (area: 'all' | GrowingAreaType) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

type SeedSortKey =
  | 'seedCode'
  | 'seedName'
  | 'growingArea'
  | 'daysToHarvest'
  | 'avgRainfedHarvestTha'
  | 'highestPossibleHarvestTha'
  | 'droughtTolerance';

export function SeedPerformanceView({
  toleranceFilter,
  onChangeToleranceFilter,
  areaFilter,
  onChangeAreaFilter,
  searchQuery,
  onChangeSearchQuery,
}: SeedPerformanceViewProps) {
  const [sortKey, setSortKey] = useState<SeedSortKey>('avgRainfedHarvestTha');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>('nsic-rc480');
  const [farmHectares, setFarmHectares] = useState<number>(2);

  const philRiceStats = computePhilRiceAverageRainfedYield(SEED_PERFORMANCE_DATA);
  const philRiceVarieties = SEED_PERFORMANCE_DATA.filter((r) => !r.isTraditional);
  const comparison = compareSeedAgainstTraditional(
    selectedVarietyId,
    farmHectares,
    SEED_PERFORMANCE_DATA,
  );

  const filteredRows = useMemo(
    () =>
      filterSeedPerformance(SEED_PERFORMANCE_DATA, {
        toleranceFilter,
        areaFilter,
        searchQuery,
      }),
    [toleranceFilter, areaFilter, searchQuery],
  );

  const sortedRows = useMemo(
    () => sortByKey(filteredRows, sortKey, sortDir),
    [filteredRows, sortKey, sortDir],
  );

  const handleSort = (key: SeedSortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'daysToHarvest' || key === 'seedCode' ? 'asc' : 'desc');
    }
  };

  const resetFilters = () => {
    onChangeToleranceFilter('all');
    onChangeAreaFilter('all');
    onChangeSearchQuery('');
  };

  const hasActiveFilters =
    toleranceFilter !== 'all' || areaFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Interactive Seed Advantage Simulator against Traditional Inbred (2.10 t/ha, 125 days) */}
      <section
        aria-label="Interactive Seed Advantage Calculator"
        className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              Drought-Tolerant Variety vs. Traditional Inbred Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare any DA-PhilRice variety against Traditional / Local (2.10 t/ha · 125 days) · PhilRice mean: {philRiceStats.meanTha.toFixed(2)} t/ha (+{philRiceStats.advantagePercent}%)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-2 border-t border-slate-100">
          <div className="md:col-span-5">
            <label
              htmlFor="variety-select"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              PhilRice Variety
            </label>
            <select
              id="variety-select"
              value={selectedVarietyId}
              onChange={(e) => setSelectedVarietyId(e.target.value)}
              className="w-full px-3 py-2 min-h-[42px] text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
            >
              {philRiceVarieties.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.seedCode} — {v.seedName} ({v.avgRainfedHarvestTha.toFixed(2)} t/ha · {v.daysToHarvest}d)
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="hectares-input"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Farm Area (hectares)
            </label>
            <input
              id="hectares-input"
              type="number"
              min={0.5}
              max={1000}
              step={0.5}
              value={farmHectares}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                setFarmHectares(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
              }}
              className="w-full px-3 py-2 min-h-[42px] text-sm font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
            />
          </div>

          {comparison && (
            <div className="md:col-span-4 grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs">
              <div>
                <div className="text-slate-500">Yield Gain</div>
                <div className="font-mono-tabular text-sm font-bold text-[#14452F] mt-0.5">
                  +{comparison.yieldGainPercent}%
                </div>
                <div className="font-mono-tabular text-[11px] text-slate-600">
                  +{comparison.yieldDeltaTha.toFixed(2)} t/ha
                </div>
              </div>
              <div>
                <div className="text-slate-500">Harvest Speed</div>
                <div className="font-mono-tabular text-sm font-bold text-slate-900 mt-0.5">
                  {comparison.daysSaved}d faster
                </div>
                <div className="font-mono-tabular text-[11px] text-slate-600">
                  {comparison.variety.daysToHarvest} vs 125d
                </div>
              </div>
              <div>
                <div className="text-slate-500">Extra Yield</div>
                <div className="font-mono-tabular text-sm font-bold text-[#14452F] mt-0.5">
                  +{comparison.estimatedExtraTonsForArea.toFixed(2)} MT
                </div>
                <div className="font-mono-tabular text-[11px] text-slate-600">
                  on {farmHectares} ha
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Seed Chart */}
      <SeedComparisonChart />

      {/* Filterable & Sortable DA-PhilRice Seed Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Seed Performance Dataset (DA-PhilRice)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {sortedRows.length} of {SEED_PERFORMANCE_DATA.length} rice varieties
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                placeholder="Search seed code or name..."
                aria-label="Search seed varieties"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by drought tolerance">
              {(
                [
                  { id: 'all', label: 'All Tolerance' },
                  { id: 'High', label: 'High' },
                  { id: 'Moderate-High', label: 'Moderate-High' },
                  { id: 'Moderate', label: 'Moderate' },
                  { id: 'Low', label: 'Low' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeToleranceFilter(opt.id)}
                  className={`px-2.5 py-1.5 min-h-[34px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    toleranceFilter === opt.id
                      ? 'bg-[#14452F] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by growing area">
              {(
                [
                  { id: 'all', label: 'All Areas' },
                  { id: 'Rainfed Lowland', label: 'Rainfed Lowland' },
                  { id: 'Upland', label: 'Upland' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeAreaFilter(opt.id)}
                  className={`px-2.5 py-1.5 min-h-[34px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    areaFilter === opt.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-[#14452F] hover:underline ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {sortedRows.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              No rice varieties match your current filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 min-h-[40px] rounded-lg bg-[#14452F] text-white text-xs font-medium hover:bg-[#0f3624]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="bg-[#14452F] text-white text-xs font-semibold">
                  <SeedSortHeader
                    label="Seed Code"
                    active={sortKey === 'seedCode'}
                    direction={sortDir}
                    onClick={() => handleSort('seedCode')}
                  />
                  <SeedSortHeader
                    label="Seed Name"
                    active={sortKey === 'seedName'}
                    direction={sortDir}
                    onClick={() => handleSort('seedName')}
                  />
                  <SeedSortHeader
                    label="Growing Area"
                    active={sortKey === 'growingArea'}
                    direction={sortDir}
                    onClick={() => handleSort('growingArea')}
                  />
                  <SeedSortHeader
                    label="Days to Harvest"
                    align="right"
                    active={sortKey === 'daysToHarvest'}
                    direction={sortDir}
                    onClick={() => handleSort('daysToHarvest')}
                  />
                  <SeedSortHeader
                    label="Avg Rainfed (t/ha)"
                    align="right"
                    active={sortKey === 'avgRainfedHarvestTha'}
                    direction={sortDir}
                    onClick={() => handleSort('avgRainfedHarvestTha')}
                  />
                  <SeedSortHeader
                    label="Highest Possible (t/ha)"
                    align="right"
                    active={sortKey === 'highestPossibleHarvestTha'}
                    direction={sortDir}
                    onClick={() => handleSort('highestPossibleHarvestTha')}
                  />
                  <SeedSortHeader
                    label="Drought Tolerance"
                    active={sortKey === 'droughtTolerance'}
                    direction={sortDir}
                    onClick={() => handleSort('droughtTolerance')}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {sortedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`h-11 hover:bg-slate-50 transition-colors ${
                      row.isTraditional ? 'bg-slate-50/80' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                      {row.seedCode}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 whitespace-nowrap">
                      {row.seedName}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                      {row.growingArea}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.daysToHarvest}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular font-semibold text-slate-900">
                      {row.avgRainfedHarvestTha.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.highestPossibleHarvestTha.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <ToleranceLabel level={row.droughtTolerance} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function ToleranceLabel({ level }: { level: SeedPerformanceRow['droughtTolerance'] }) {
  const tone =
    level === 'High'
      ? 'text-[#14452F] font-semibold'
      : level === 'Moderate-High'
        ? 'text-emerald-700 font-medium'
        : level === 'Moderate'
          ? 'text-amber-700 font-medium'
          : 'text-red-700 font-semibold';
  return <span className={tone}>{level}</span>;
}

function SeedSortHeader({
  label,
  align = 'left',
  active,
  direction,
  onClick,
}: {
  label: string;
  align?: 'left' | 'right';
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <th scope="col" className={`px-4 py-3 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 hover:text-emerald-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        <span>{label}</span>
        {active ? (
          direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-60 shrink-0" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}
