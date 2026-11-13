import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EL_NINO_DAMAGE_REPORT,
  REGIONAL_PALAY_STATS,
  SEED_PERFORMANCE_DATA,
} from '../data/seedsOfSurvivalData';
import {
  buildCsvContent,
  compareSeedAgainstTraditional,
  computeDamageTotals,
  computePhilRiceAverageRainfedYield,
  computeRegionalYieldDropSummary,
  filterDamageReport,
  filterRegionalPalayStats,
  filterSeedPerformance,
  formatPhpBillions,
  sortByKey,
} from './analytics';

test('El Niño damage totals match Project Overview figures exactly', () => {
  const totals = computeDamageTotals(EL_NINO_DAMAGE_REPORT);
  assert.equal(totals.affectedFarmers, 107970);
  assert.equal(totals.damagedAreaHa, 125450);
  assert.equal(totals.productionLossMt, 331100);
  assert.equal(totals.financialLossPhp, 8435000000);
  assert.equal(formatPhpBillions(totals.financialLossPhp), '₱8.435B');
});

test('PhilRice mean rainfed yield and advantage match 3.43 t/ha and +63.5%', () => {
  const stats = computePhilRiceAverageRainfedYield(SEED_PERFORMANCE_DATA);
  assert.equal(stats.meanTha, 3.43);
  assert.equal(stats.traditionalTha, 2.1);
  assert.equal(stats.advantagePercent, 63.5);
});

test('Regional yield drop 2021 to 2024 matches -20.0% in Central Luzon and -21.9% in Cagayan Valley', () => {
  const cl = computeRegionalYieldDropSummary('central-luzon', REGIONAL_PALAY_STATS);
  const cv = computeRegionalYieldDropSummary('cagayan-valley', REGIONAL_PALAY_STATS);

  assert.ok(cl);
  assert.ok(cv);
  assert.equal(cl.baseline2021Yield, 5.25);
  assert.equal(cl.drought2024Yield, 4.2);
  assert.equal(cl.drop2021To2024Percent, -20);

  assert.equal(cv.baseline2021Yield, 4.8);
  assert.equal(cv.drought2024Yield, 3.75);
  assert.equal(cv.drop2021To2024Percent, -21.9);
});

test('Seed comparator calculates yield delta, percentage gain, days saved, and area bonus', () => {
  const comparison = compareSeedAgainstTraditional('nsic-rc480', 5, SEED_PERFORMANCE_DATA);
  assert.ok(comparison);
  assert.equal(comparison.variety.seedCode, 'NSIC Rc480');
  assert.equal(comparison.yieldDeltaTha, 1.7);
  assert.equal(comparison.yieldGainPercent, 81);
  assert.equal(comparison.daysSaved, 18);
  assert.equal(comparison.estimatedExtraTonsForArea, 8.5);
});

test('Filtering and sorting functions work accurately across datasets', () => {
  const filteredPalay = filterRegionalPalayStats(REGIONAL_PALAY_STATS, {
    regionFilter: 'cagayan-valley',
    yearStart: 2023,
    yearEnd: 2024,
  });
  assert.equal(filteredPalay.length, 2);
  assert.deepEqual(
    filteredPalay.map((r) => r.year),
    [2023, 2024],
  );

  const highToleranceSeeds = filterSeedPerformance(SEED_PERFORMANCE_DATA, {
    toleranceFilter: 'High',
    areaFilter: 'all',
  });
  assert.equal(highToleranceSeeds.length, 3);

  const sortedByDays = sortByKey(SEED_PERFORMANCE_DATA, 'daysToHarvest', 'asc');
  assert.equal(sortedByDays[0].seedCode, 'NSIC Rc192');
  assert.equal(sortedByDays[sortedByDays.length - 1].seedCode, 'Traditional / Local');

  const filteredDamage = filterDamageReport(EL_NINO_DAMAGE_REPORT, {
    regionFilter: 'all',
    searchQuery: 'ilocos',
  });
  assert.equal(filteredDamage.length, 1);
  assert.equal(filteredDamage[0].affectedFarmers, 19800);
});

test('CSV builder escapes commas and quotes properly', () => {
  const csv = buildCsvContent(
    ['Region', 'Note', 'Loss'],
    [['Central Luzon (Region III)', 'High impact, "2024"', 2145000000]],
  );
  assert.equal(csv, 'Region,Note,Loss\nCentral Luzon (Region III),"High impact, ""2024""",2145000000');
});
