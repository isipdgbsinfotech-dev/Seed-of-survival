import { useState } from 'react';
import {
  EL_NINO_DAMAGE_REPORT,
  type RegionId,
} from '../../data/seedsOfSurvivalData';

export type DamageMetricKey =
  | 'financialLossPhp'
  | 'affectedFarmers'
  | 'damagedAreaHa'
  | 'productionLossMt';

interface RegionalDamageChartProps {
  selectedRegion: 'all' | RegionId;
  onSelectRegion: (region: 'all' | RegionId) => void;
}

const DAMAGE_METRICS: Record<
  DamageMetricKey,
  {
    label: string;
    shortLabel: string;
    max: number;
    formatValue: (v: number) => string;
  }
> = {
  financialLossPhp: {
    label: 'Financial Loss (PHP)',
    shortLabel: 'Loss (₱B)',
    max: 3_100_000_000,
    formatValue: (v) => `₱${(v / 1_000_000_000).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}B`,
  },
  affectedFarmers: {
    label: 'Affected Farmers',
    shortLabel: 'Farmers',
    max: 38000,
    formatValue: (v) => v.toLocaleString('en-US'),
  },
  damagedAreaHa: {
    label: 'Damaged Area (ha)',
    shortLabel: 'Area (ha)',
    max: 46000,
    formatValue: (v) => `${v.toLocaleString('en-US')} ha`,
  },
  productionLossMt: {
    label: 'Production Loss (MT)',
    shortLabel: 'Loss (MT)',
    max: 125000,
    formatValue: (v) => `${v.toLocaleString('en-US')} MT`,
  },
};

export function RegionalDamageChart({
  selectedRegion,
  onSelectRegion,
}: RegionalDamageChartProps) {
  const [metric, setMetric] = useState<DamageMetricKey>('financialLossPhp');
  const cfg = DAMAGE_METRICS[metric];

  const sortedRows = [...EL_NINO_DAMAGE_REPORT].sort((a, b) => b[metric] - a[metric]);

  return (
    <section
      aria-label="El Niño Agricultural Loss and Damage by Region"
      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 h-full"
    >
      <div className="space-y-3">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            El Niño Damage by Region
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            DA-DRRM · Click any region row to cross-filter dashboard
          </p>
        </div>

        <div
          role="group"
          aria-label="Select damage metric"
          className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg"
        >
          {(Object.keys(DAMAGE_METRICS) as DamageMetricKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`px-2 py-1.5 min-h-[32px] text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
                metric === key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {DAMAGE_METRICS[key].shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {sortedRows.map((row) => {
          const val = row[metric];
          const pct = Math.min(100, Math.round((val / cfg.max) * 100));
          const isSelected = selectedRegion === row.regionId;
          const isDimmed = selectedRegion !== 'all' && !isSelected;

          return (
            <button
              key={row.id}
              type="button"
              onClick={() =>
                onSelectRegion(isSelected ? 'all' : row.regionId)
              }
              aria-pressed={isSelected}
              className={`w-full text-left p-3 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F] ${
                isSelected
                  ? 'border-[#14452F] bg-emerald-50/40'
                  : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70'
              } ${isDimmed ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-slate-900 truncate">
                  {row.region}
                </span>
                <span className="font-mono-tabular font-semibold text-slate-900 shrink-0">
                  {cfg.formatValue(val)}
                </span>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-sm overflow-hidden">
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${
                    isSelected ? 'bg-[#14452F]' : 'bg-[#B45309]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500 tabular-nums">
                <span>{row.affectedFarmers.toLocaleString('en-US')} farmers</span>
                <span aria-hidden="true">·</span>
                <span>{row.damagedAreaHa.toLocaleString('en-US')} ha</span>
                <span aria-hidden="true">·</span>
                <span>{row.productionLossMt.toLocaleString('en-US')} MT</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span>
          {selectedRegion === 'all'
            ? 'Showing all 4 affected regions'
            : 'Filtered to selected region'}
        </span>
        {selectedRegion !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectRegion('all')}
            className="font-medium text-[#14452F] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F]"
          >
            Reset region filter
          </button>
        )}
      </div>
    </section>
  );
}
