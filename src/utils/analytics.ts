import {
  EL_NINO_DAMAGE_REPORT,
  REGIONAL_PALAY_STATS,
  SEED_PERFORMANCE_DATA,
  type DroughtToleranceLevel,
  type ElNinoDamageRow,
  type GrowingAreaType,
  type RegionId,
  type RegionalPalayRow,
  type SeedPerformanceRow,
} from '../data/seedsOfSurvivalData';

export type SortDirection = 'asc' | 'desc';

export interface DamageTotals {
  affectedFarmers: number;
  damagedAreaHa: number;
  productionLossMt: number;
  financialLossPhp: number;
}

export interface SeedComparisonMetrics {
  variety: SeedPerformanceRow;
  baseline: SeedPerformanceRow;
  yieldDeltaTha: number;
  yieldGainPercent: number;
  daysSaved: number;
  peakPotentialDeltaTha: number;
  estimatedExtraTonsForArea: number;
}

export interface RegionalYieldSummary {
  regionId: 'central-luzon' | 'cagayan-valley';
  regionName: string;
  baseline2021Yield: number;
  drought2024Yield: number;
  recovery2025Yield: number;
  drop2021To2024Percent: number;
  recovery2024To2025Percent: number;
}

export function computeDamageTotals(rows: ElNinoDamageRow[] = EL_NINO_DAMAGE_REPORT): DamageTotals {
  return rows.reduce<DamageTotals>(
    (acc, row) => ({
      affectedFarmers: acc.affectedFarmers + row.affectedFarmers,
      damagedAreaHa: acc.damagedAreaHa + row.damagedAreaHa,
      productionLossMt: acc.productionLossMt + row.productionLossMt,
      financialLossPhp: acc.financialLossPhp + row.financialLossPhp,
    }),
    {
      affectedFarmers: 0,
      damagedAreaHa: 0,
      productionLossMt: 0,
      financialLossPhp: 0,
    },
  );
}

export function computePhilRiceAverageRainfedYield(
  rows: SeedPerformanceRow[] = SEED_PERFORMANCE_DATA,
): { meanTha: number; traditionalTha: number; advantagePercent: number } {
  const philRice = rows.filter((r) => !r.isTraditional);
  const traditional = rows.find((r) => r.isTraditional);
  const traditionalTha = traditional ? traditional.avgRainfedHarvestTha : 2.1;

  if (philRice.length === 0) {
    return { meanTha: 0, traditionalTha, advantagePercent: 0 };
  }

  const sum = philRice.reduce((acc, r) => acc + r.avgRainfedHarvestTha, 0);
  const meanTha = Number((sum / philRice.length).toFixed(2));
  const advantagePercent = Number((((sum / philRice.length - traditionalTha) / traditionalTha) * 100).toFixed(1));

  return { meanTha, traditionalTha, advantagePercent };
}

export function compareSeedAgainstTraditional(
  varietyId: string,
  hectares = 1,
  rows: SeedPerformanceRow[] = SEED_PERFORMANCE_DATA,
): SeedComparisonMetrics | null {
  const baseline = rows.find((r) => r.isTraditional);
  const variety = rows.find((r) => r.id === varietyId);
  if (!baseline || !variety) return null;

  const safeHectares = Number.isFinite(hectares) && hectares > 0 ? hectares : 0;
  const yieldDeltaTha = Number((variety.avgRainfedHarvestTha - baseline.avgRainfedHarvestTha).toFixed(2));
  const yieldGainPercent = Number(
    (((variety.avgRainfedHarvestTha - baseline.avgRainfedHarvestTha) / baseline.avgRainfedHarvestTha) * 100).toFixed(
      1,
    ),
  );
  const daysSaved = baseline.daysToHarvest - variety.daysToHarvest;
  const peakPotentialDeltaTha = Number(
    (variety.highestPossibleHarvestTha - baseline.highestPossibleHarvestTha).toFixed(2),
  );
  const estimatedExtraTonsForArea = Number((yieldDeltaTha * safeHectares).toFixed(2));

  return {
    variety,
    baseline,
    yieldDeltaTha,
    yieldGainPercent,
    daysSaved,
    peakPotentialDeltaTha,
    estimatedExtraTonsForArea,
  };
}

export function computeRegionalYieldDropSummary(
  regionId: 'central-luzon' | 'cagayan-valley',
  rows: RegionalPalayRow[] = REGIONAL_PALAY_STATS,
): RegionalYieldSummary | null {
  const regional = rows.filter((r) => r.regionId === regionId);
  const y2021 = regional.find((r) => r.year === 2021);
  const y2024 = regional.find((r) => r.year === 2024);
  const y2025 = regional.find((r) => r.year === 2025);

  if (!y2021 || !y2024 || !y2025) return null;

  const drop2021To2024Percent = Number(
    (((y2024.averageYieldTha - y2021.averageYieldTha) / y2021.averageYieldTha) * 100).toFixed(1),
  );
  const recovery2024To2025Percent = Number(
    (((y2025.averageYieldTha - y2024.averageYieldTha) / y2024.averageYieldTha) * 100).toFixed(1),
  );

  return {
    regionId,
    regionName: y2021.region,
    baseline2021Yield: y2021.averageYieldTha,
    drought2024Yield: y2024.averageYieldTha,
    recovery2025Yield: y2025.averageYieldTha,
    drop2021To2024Percent,
    recovery2024To2025Percent,
  };
}

export function filterRegionalPalayStats(
  rows: RegionalPalayRow[],
  options: {
    regionFilter: 'all' | 'central-luzon' | 'cagayan-valley';
    yearStart?: number;
    yearEnd?: number;
    severityFilter?: 'all' | 'normal' | 'onset' | 'severe' | 'recovery';
    searchQuery?: string;
  },
): RegionalPalayRow[] {
  const query = (options.searchQuery ?? '').trim().toLowerCase();
  return rows.filter((row) => {
    if (options.regionFilter !== 'all' && row.regionId !== options.regionFilter) {
      return false;
    }
    if (options.yearStart !== undefined && row.year < options.yearStart) {
      return false;
    }
    if (options.yearEnd !== undefined && row.year > options.yearEnd) {
      return false;
    }
    if (options.severityFilter && options.severityFilter !== 'all' && row.climateSeverity !== options.severityFilter) {
      return false;
    }
    if (query) {
      const hay = `${row.region} ${row.year} ${row.climateCondition}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function filterSeedPerformance(
  rows: SeedPerformanceRow[],
  options: {
    toleranceFilter: 'all' | DroughtToleranceLevel;
    areaFilter: 'all' | GrowingAreaType;
    searchQuery?: string;
  },
): SeedPerformanceRow[] {
  const query = (options.searchQuery ?? '').trim().toLowerCase();
  return rows.filter((row) => {
    if (options.toleranceFilter !== 'all' && row.droughtTolerance !== options.toleranceFilter) {
      return false;
    }
    if (options.areaFilter !== 'all' && row.growingArea !== options.areaFilter) {
      return false;
    }
    if (query) {
      const hay = `${row.seedCode} ${row.seedName} ${row.growingArea} ${row.droughtTolerance}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function filterDamageReport(
  rows: ElNinoDamageRow[],
  options: {
    regionFilter: 'all' | RegionId;
    searchQuery?: string;
  },
): ElNinoDamageRow[] {
  const query = (options.searchQuery ?? '').trim().toLowerCase();
  return rows.filter((row) => {
    if (options.regionFilter !== 'all' && row.regionId !== options.regionFilter) {
      return false;
    }
    if (query) {
      const hay = `${row.region} ${row.shortRegion}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function sortByKey<T>(
  rows: T[],
  key: keyof T,
  direction: SortDirection,
): T[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    if (strA < strB) return direction === 'asc' ? -1 : 1;
    if (strA > strB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return copy;
}

export function formatPhpCurrency(amount: number): string {
  return `₱${amount.toLocaleString('en-US')}`;
}

export function formatPhpBillions(amount: number): string {
  const billions = amount / 1_000_000_000;
  return `₱${billions.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}B`;
}

export function escapeCsvCell(value: string | number | boolean): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsvContent(headers: string[], rows: Array<Array<string | number | boolean>>): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const bodyLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...bodyLines].join('\n');
}
