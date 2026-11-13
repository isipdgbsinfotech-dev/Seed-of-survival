import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import {
  EL_NINO_DAMAGE_REPORT,
  type RegionId,
} from '../../data/seedsOfSurvivalData';
import {
  computeDamageTotals,
  filterDamageReport,
  formatPhpBillions,
  formatPhpCurrency,
  sortByKey,
  type SortDirection,
} from '../../utils/analytics';
import { RegionalDamageChart } from '../charts/RegionalDamageChart';

interface DamageReportViewProps {
  selectedRegion: 'all' | RegionId;
  onSelectRegion: (region: 'all' | RegionId) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

type DamageSortKey =
  | 'region'
  | 'affectedFarmers'
  | 'damagedAreaHa'
  | 'productionLossMt'
  | 'financialLossPhp';

export function DamageReportView({
  selectedRegion,
  onSelectRegion,
  searchQuery,
  onChangeSearchQuery,
}: DamageReportViewProps) {
  const [sortKey, setSortKey] = useState<DamageSortKey>('financialLossPhp');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const filteredRows = useMemo(
    () =>
      filterDamageReport(EL_NINO_DAMAGE_REPORT, {
        regionFilter: selectedRegion,
        searchQuery,
      }),
    [selectedRegion, searchQuery],
  );

  const sortedRows = useMemo(
    () => sortByKey(filteredRows, sortKey, sortDir),
    [filteredRows, sortKey, sortDir],
  );

  const totals = computeDamageTotals(filteredRows);

  const handleSort = (key: DamageSortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'region' ? 'asc' : 'desc');
    }
  };

  const resetFilters = () => {
    onSelectRegion('all');
    onChangeSearchQuery('');
  };

  const hasActiveFilters = selectedRegion !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Totals Summary Strip */}
      <section aria-label="El Niño Damage Totals" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-600">Affected Farmers</div>
          <div className="font-mono-tabular text-2xl font-semibold text-slate-900 mt-1">
            {totals.affectedFarmers.toLocaleString('en-US')}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-600">Damaged Area</div>
          <div className="font-mono-tabular text-2xl font-semibold text-slate-900 mt-1">
            {totals.damagedAreaHa.toLocaleString('en-US')} ha
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-600">Production Loss</div>
          <div className="font-mono-tabular text-2xl font-semibold text-slate-900 mt-1">
            {totals.productionLossMt.toLocaleString('en-US')} MT
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-600">Financial Loss</div>
          <div className="font-mono-tabular text-2xl font-semibold text-red-700 mt-1">
            {formatPhpBillions(totals.financialLossPhp)}
          </div>
        </div>
      </section>

      {/* Interactive Damage Chart */}
      <RegionalDamageChart
        selectedRegion={selectedRegion}
        onSelectRegion={onSelectRegion}
      />

      {/* Sortable DA-DRRM Report Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              El Niño Agricultural Loss &amp; Damage Report (DA-DRRM)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {sortedRows.length} of {EL_NINO_DAMAGE_REPORT.length} affected regions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search
                className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                placeholder="Search region..."
                aria-label="Search damage report regions"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-[#14452F] hover:underline whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {sortedRows.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              No regions match your current filter or search query.
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
                  <DamageSortHeader
                    label="Region"
                    active={sortKey === 'region'}
                    direction={sortDir}
                    onClick={() => handleSort('region')}
                  />
                  <DamageSortHeader
                    label="Affected Farmers"
                    align="right"
                    active={sortKey === 'affectedFarmers'}
                    direction={sortDir}
                    onClick={() => handleSort('affectedFarmers')}
                  />
                  <DamageSortHeader
                    label="Damaged Area (ha)"
                    align="right"
                    active={sortKey === 'damagedAreaHa'}
                    direction={sortDir}
                    onClick={() => handleSort('damagedAreaHa')}
                  />
                  <DamageSortHeader
                    label="Production Loss (MT)"
                    align="right"
                    active={sortKey === 'productionLossMt'}
                    direction={sortDir}
                    onClick={() => handleSort('productionLossMt')}
                  />
                  <DamageSortHeader
                    label="Financial Loss (PHP)"
                    align="right"
                    active={sortKey === 'financialLossPhp'}
                    direction={sortDir}
                    onClick={() => handleSort('financialLossPhp')}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {sortedRows.map((row) => (
                  <tr key={row.id} className="h-11 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                      {row.region}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.affectedFarmers.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.damagedAreaHa.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-700">
                      {row.productionLossMt.toLocaleString('en-US')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular font-semibold text-slate-900">
                      {formatPhpCurrency(row.financialLossPhp)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900">
                  <td className="px-4 py-3 whitespace-nowrap">
                    Total ({sortedRows.length} {sortedRows.length === 1 ? 'Region' : 'Regions'})
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tabular">
                    {totals.affectedFarmers.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tabular">
                    {totals.damagedAreaHa.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tabular">
                    {totals.productionLossMt.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-tabular text-red-700">
                    {formatPhpCurrency(totals.financialLossPhp)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function DamageSortHeader({
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
