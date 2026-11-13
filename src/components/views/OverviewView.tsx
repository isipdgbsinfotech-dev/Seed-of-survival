import { ArrowRight } from 'lucide-react';
import riceFarmBackdrop from '../../assets/images/rice_farm_backdrop_1794573573251.jpg';
import {
  INSIGHTS_SUMMARY,
  PROJECT_TITLE,
  type RegionId,
} from '../../data/seedsOfSurvivalData';
import { KpiStrip } from '../KpiStrip';
import { RegionalDamageChart } from '../charts/RegionalDamageChart';
import { SeedComparisonChart } from '../charts/SeedComparisonChart';
import { YieldTrendChart } from '../charts/YieldTrendChart';
import type { DashboardTabId } from '../Sidebar';

interface OverviewViewProps {
  selectedRegion: 'all' | RegionId;
  onSelectRegion: (region: 'all' | RegionId) => void;
  yearRange: [number, number];
  onChangeYearRange: (range: [number, number]) => void;
  onNavigateTab: (tab: DashboardTabId) => void;
}

const REGION_OPTIONS: Array<{ id: 'all' | RegionId; label: string }> = [
  { id: 'all', label: 'All Regions' },
  { id: 'central-luzon', label: 'Central Luzon (III)' },
  { id: 'cagayan-valley', label: 'Cagayan Valley (II)' },
  { id: 'ilocos', label: 'Ilocos Region (I)' },
  { id: 'western-visayas', label: 'Western Visayas (VI)' },
];

const YEAR_PRESETS: Array<{ label: string; range: [number, number] }> = [
  { label: '2021–2025 (Full)', range: [2021, 2025] },
  { label: '2021–2024', range: [2021, 2024] },
  { label: '2023–2025', range: [2023, 2025] },
];

export function OverviewView({
  selectedRegion,
  onSelectRegion,
  yearRange,
  onChangeYearRange,
  onNavigateTab,
}: OverviewViewProps) {
  return (
    <div className="space-y-6">
      {/* Farmer-Themed Rice Field Header & Interactive Filter Bar */}
      <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#113A27] via-[#14452F] to-[#235D3A] p-5 sm:p-6">
          <img
            src={riceFarmBackdrop}
            alt="Philippine terraced rice paddies at golden hour"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0C291B]/90 via-[#14452F]/80 to-[#14452F]/55"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="max-w-3xl">
              <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug text-balance">
                {PROJECT_TITLE}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5">
                Study coverage: Central Luzon (Region III) &amp; Cagayan Valley (Region II) · Damage scope: Regions I, II, III &amp; VI
              </p>
            </div>
            {selectedRegion !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  onSelectRegion('all');
                  onChangeYearRange([2021, 2025]);
                }}
                className="self-start lg:self-center px-3.5 py-2 min-h-[38px] text-xs font-semibold text-white bg-white/15 border border-white/30 rounded-lg hover:bg-white/25 transition-colors whitespace-nowrap shrink-0 backdrop-blur-xs"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <label
              htmlFor="overview-region-select"
              className="text-xs font-medium text-slate-600 whitespace-nowrap shrink-0"
            >
              Region Scope
            </label>
            <select
              id="overview-region-select"
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value as 'all' | RegionId)}
              className="w-full sm:w-56 px-3 py-1.5 min-h-[38px] text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-2 focus:outline-[#14452F]"
            >
              {REGION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full"
            role="group"
            aria-label="Filter palay trend years"
          >
            {YEAR_PRESETS.map((preset) => {
              const active =
                yearRange[0] === preset.range[0] && yearRange[1] === preset.range[1];
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeYearRange(preset.range)}
                  aria-pressed={active}
                  className={`px-2.5 py-1.5 min-h-[32px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#14452F] ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4-Column KPI Summary */}
      <KpiStrip selectedRegion={selectedRegion} />

      {/* Main 2-Column Visual Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-7 flex flex-col">
          <YieldTrendChart selectedRegion={selectedRegion} yearRange={yearRange} />
        </div>
        <div className="xl:col-span-5 flex flex-col">
          <RegionalDamageChart
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
          />
        </div>
      </div>

      {/* Seed Performance Comparison Chart */}
      <SeedComparisonChart />

      {/* Key Findings & Actionable Recommendations Strip */}
      <section
        aria-label="Key findings and recommendations summary"
        className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              Key Findings &amp; Policy Recommendations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Synthesized diagnostic insights from PSA OpenSTAT, DA-PhilRice, and DA-DRRM datasets
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('insights')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14452F] hover:underline self-start sm:self-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F]"
          >
            <span>View Project &amp; Sources</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          {INSIGHTS_SUMMARY.map((item) => (
            <div
              key={item.id}
              className="py-2 flex flex-col justify-between gap-2 border-b md:border-b-0 md:border-r last:border-b-0 last:border-r-0 border-slate-100 md:pr-4 last:pr-0"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {item.number}. {item.topic}
                  </span>
                  <span className="font-mono-tabular text-sm font-bold text-[#14452F]">
                    {item.headlineMetric}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {item.keyFindings}
                </p>
              </div>
              <p className="text-xs text-slate-800 font-medium pt-1.5 border-t border-slate-100/80">
                Action: {item.recommendations}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
