import type { RegionId } from '../data/seedsOfSurvivalData';
import {
  EL_NINO_DAMAGE_REPORT,
  REGIONAL_PALAY_STATS,
  SEED_PERFORMANCE_DATA,
} from '../data/seedsOfSurvivalData';
import {
  computeDamageTotals,
  computePhilRiceAverageRainfedYield,
  computeRegionalYieldDropSummary,
  formatPhpBillions,
} from '../utils/analytics';

interface KpiStripProps {
  selectedRegion: 'all' | RegionId;
}

export function KpiStrip({ selectedRegion }: KpiStripProps) {
  const filteredDamage =
    selectedRegion === 'all'
      ? EL_NINO_DAMAGE_REPORT
      : EL_NINO_DAMAGE_REPORT.filter((r) => r.regionId === selectedRegion);

  const damageTotals = computeDamageTotals(filteredDamage);
  const seedStats = computePhilRiceAverageRainfedYield(SEED_PERFORMANCE_DATA);
  const clSummary = computeRegionalYieldDropSummary('central-luzon', REGIONAL_PALAY_STATS);
  const cvSummary = computeRegionalYieldDropSummary('cagayan-valley', REGIONAL_PALAY_STATS);

  const scopeLabel =
    selectedRegion === 'all'
      ? '4 regions'
      : filteredDamage[0]?.shortRegion ?? 'Selected region';

  const fourthCard = (() => {
    if (selectedRegion === 'central-luzon' && clSummary) {
      return {
        label: '2024 Yield Drop (Region III)',
        value: `${clSummary.drop2021To2024Percent}%`,
        meta: `${clSummary.baseline2021Yield.toFixed(2)} to ${clSummary.drought2024Yield.toFixed(2)} t/ha (2021–2024)`,
        tone: 'text-red-700',
      };
    }
    if (selectedRegion === 'cagayan-valley' && cvSummary) {
      return {
        label: '2024 Yield Drop (Region II)',
        value: `${cvSummary.drop2021To2024Percent}%`,
        meta: `${cvSummary.baseline2021Yield.toFixed(2)} to ${cvSummary.drought2024Yield.toFixed(2)} t/ha (2021–2024)`,
        tone: 'text-red-700',
      };
    }
    return {
      label: 'PhilRice Rainfed Advantage',
      value: `+${seedStats.advantagePercent}%`,
      meta: `${seedStats.meanTha.toFixed(2)} vs ${seedStats.traditionalTha.toFixed(2)} t/ha traditional`,
      tone: 'text-[#14452F]',
    };
  })();

  const cards = [
    {
      label: 'Total Financial Loss',
      value: formatPhpBillions(damageTotals.financialLossPhp),
      meta: `DA-DRRM · ${scopeLabel}`,
      tone: 'text-slate-900',
    },
    {
      label: 'Affected Farmers',
      value: damageTotals.affectedFarmers.toLocaleString('en-US'),
      meta: `Registered farmers · ${scopeLabel}`,
      tone: 'text-slate-900',
    },
    {
      label: 'Damaged Farmland',
      value: `${damageTotals.damagedAreaHa.toLocaleString('en-US')} ha`,
      meta: `${damageTotals.productionLossMt.toLocaleString('en-US')} MT production loss`,
      tone: 'text-slate-900',
    },
    fourthCard,
  ];

  return (
    <section aria-label="Key agricultural impact metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-2"
        >
          <div className="text-xs font-medium text-slate-600">{card.label}</div>
          <div className={`font-mono-tabular text-2xl sm:text-[28px] font-semibold tracking-tight leading-none ${card.tone}`}>
            {card.value}
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 tabular-nums truncate">
            {card.meta}
          </div>
        </div>
      ))}
    </section>
  );
}
