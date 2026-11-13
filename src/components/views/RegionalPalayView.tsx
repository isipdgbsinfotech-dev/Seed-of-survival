import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import {
  REGIONAL_PALAY_STATS,
  type RegionalPalayRow,
} from '../../data/seedsOfSurvivalData';
import {
  computeRegionalYieldDropSummary,
  filterRegionalPalayStats,
  sortByKey,
  type SortDirection,
} from '../../utils/analytics';
import { YieldTrendChart } from '../charts/YieldTrendChart';

interface RegionalPalayViewProps {
  regionFilter: 'all' | 'central-luzon' | 'cagayan-valley';
  onChangeRegionFilter: (region: 'all' | 'central-luzon' | 'cagayan-valley') => void;
  severityFilter: 'all' | 'normal' | 'onset' | 'severe' | 'recovery';
  onChangeSeverityFilter: (
    severity: 'all' | 'normal' | 'onset' | 'severe' | 'recovery',
  ) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

type PalaySortKey =
  | 'region'
  | 'year'
  | 'climateCondition'
  | 'areaHarvestedHa'
  | 'productionMt'
  | 'averageYieldTha';

export function RegionalPalayView({
  regionFilter,
  onChangeRegionFilter,
  severityFilter,
  onChangeSeverityFilter,
  searchQuery,
  onChangeSearchQuery,
}: RegionalPalayViewProps) {
  const [sortKey, setSortKey] = useState<PalaySortKey>('year');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const clSummary = computeRegionalYieldDropSummary('central-luzon', REGIONAL_PALAY_STATS);
  const cvSummary = computeRegionalYieldDropSummary('cagayan-valley', REGIONAL_PALAY_STATS);

  const filteredRows = useMemo(
    () =>
      filterRegionalPalayStats(REGIONAL_PALAY_STATS, {
        regionFilter,
        severityFilter,
        searchQuery,
      }),
    [regionFilter, severityFilter, searchQuery],
  );

  const sortedRows = useMemo(
    () => sortByKey(filteredRows, sortKey, sortDir),
    [filteredRows, sortKey, sortDir],
  );

  const handleSort = (key: PalaySortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    onChangeRegionFilter('all');
    onChangeSeverityFilter('all');
    onChangeSearchQuery('');
  };

  const hasActiveFilters =
    regionFilter !== 'all' || severityFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Regional 2021 -> 2024 -> 2025 Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clSummary && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">
                {clSummary.regionName}
              </h2>
              <span className="font-mono-tabular text-sm font-semibold text-red-700">
                {clSummary.drop2021To2024Percent}% in 2024
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <div className="text-slate-500">2021 Baseline</div>
                <div className="font-mono-tabular text-base font-semibold text-slate-900 mt-0.5">
                  {clSummary.baseline2021Yield.toFixed(2)} t/ha
                </div>
              </div>
              <div>
                <div className="text-slate-500">2024 Severe Drought</div>
                <div className="font-mono-tabular text-base font-semibold text-red-700 mt-0.5">
                  {clSummary.drought2024Yield.toFixed(2)} t/ha
                </div>
              </div>
              <div>
                <div className="text-slate-500">2025 Recovery</div>
                <div className="font-mono-tabular text-base font-semibold text-[#14452F] mt-0.5">
                  {clSummary.recovery2025Yield.toFixed(2)} t/ha
                </div>
              </div>
            </div>
          </div>
        )}

        {cvSummary && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">
                {cvSummary.regionName}
              </h2>
              <span className="font-mono-tabular text-sm font-semibold text-red-700">
                {cvSummary.drop2021To2024Percent}% in 2024
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <div className="text-slate-500">2021 Baseline</div>
                <div className="font-mono-tabular text-base font-semibold text-slate-900 mt-0.5">
                  {cvSummary.baseline2021Yield.toFixed(2)} t/ha
                </div>
              </div>
              <div>
                <div className="text-slate-500">2024 Severe Drought</div>
                <div className="font-mono-tabular text-base font-semibold text-red-700 mt-0.5">
                  {cvSummary.drought2024Yield.toFixed(2)} t/ha
                </div>
              </div>
              <div>
                <div className="text-slate-500">2025 Recovery</div>
                <div className="font-mono-tabular text-base font-semibold text-[#14452F] mt-0.5">
                  {cvSummary.recovery2025Yield.toFixed(2)} t/ha
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Trend Chart */}
      <YieldTrendChart selectedRegion={regionFilter} yearRange={[2021, 2025]} />

      {/* Filterable, Sortable PSA OpenSTAT Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Regional Palay Production &amp; Yield Records (PSA OpenSTAT)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {sortedRows.length} of {REGIONAL_PALAY_STATS.length} annual regional records
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
                placeholder="Search region, year, climate..."
                aria-label="Search regional palay records"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by region">
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'central-luzon', label: 'Central Luzon (III)' },
                { id: 'cagayan-valley', label: 'Cagayan Valley (II)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChangeRegionFilter(opt.id as 'all' | 'central-luzon' | 'cagayan-valley')
                  }
                  className={`px-2.5 py-1.5 min-h-[34px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    regionFilter === opt.id
                      ? 'bg-[#14452F] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by climate condition">
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'normal', label: 'Normal' },
                { id: 'onset', label: 'El Niño Onset' },
                { id: 'severe', label: 'Severe Drought' },
                { id: 'recovery', label: 'Recovery' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChangeSeverityFilter(
                      opt.id as 'all' | 'normal' | 'onset' | 'severe' | 'recovery',
                    )
                  }
                  className={`px-2.5 py-1.5 min-h-[34px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    severityFilter === opt.id
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
              No palay records match your current filter selection.
            </p>
            <p className="text-xs text-slate-500">
              Try clearing your search query or selecting All Regions and All Conditions.
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
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#14452F] text-white text-xs font-semibold">
                  <SortableHeader
                    label="Region"
                    active={sortKey === 'region'}
                    direction={sortDir}
                    onClick={() => handleSort('region')}
                  />
                  <SortableHeader
                    label="Year"
                    align="right"
                    active={sortKey === 'year'}
                    direction={sortDir}
                    onClick={() => handleSort('year')}
                  />
                  <SortableHeader
                    label="Climate Condition"
                    active={sortKey === 'climateCondition'}
                    direction={sortDir}
                    onClick={() => handleSort('climateCondition')}
                  />
                  <SortableHeader
                    label="Area Harvested (ha)"
                    align="right"
                    active={sortKey === 'areaHarvestedHa'}
                    direction={sortDir}
                    onClick={() => handleSort('areaHarvestedHa')}
                  />
                  <SortableHeader
                    label="Production (MT)"
                    align="right"
                    active={sortKey === 'productionMt'}
                    direction={sortDir}
                    onClick={() => handleSort('productionMt')}
                  />
                  <SortableHeader
                    label="Average Yield (t/ha)"
                    align="right"
                    active={sortKey === 'averageYieldTha'}
                    direction={sortDir}
                    onClick={() => handleSort('averageYieldTha')}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {sortedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`h-11 hover:bg-slate-50 transition-colors ${
                      row.climateSeverity === 'severe' ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                      {row.region}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.year}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <ClimateText row={row} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.areaHarvestedHa.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.productionMt.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular font-semibold text-slate-900">
                      {row.averageYieldTha.toFixed(2)}
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

function ClimateText({ row }: { row: RegionalPalayRow }) {
  const tone =
    row.climateSeverity === 'severe'
      ? 'text-red-700 font-semibold'
      : row.climateSeverity === 'onset'
        ? 'text-amber-700 font-medium'
        : row.climateSeverity === 'recovery'
          ? 'text-[#14452F] font-medium'
          : 'text-slate-700';
  return <span className={tone}>{row.climateCondition}</span>;
}

function SortableHeader({
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
