import { useState } from 'react';
import riceFarmBackdrop from './assets/images/rice_farm_backdrop_1794573573251.jpg';
import {
  DEVELOPMENT_TEAM_INFO,
  EL_NINO_DAMAGE_REPORT,
  INSIGHTS_SUMMARY,
  REGIONAL_PALAY_STATS,
  SEED_PERFORMANCE_DATA,
  type DroughtToleranceLevel,
  type GrowingAreaType,
  type RegionId,
} from './data/seedsOfSurvivalData';
import {
  buildCsvContent,
  filterDamageReport,
  filterRegionalPalayStats,
  filterSeedPerformance,
} from './utils/analytics';
import { Sidebar, type DashboardTabId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/views/OverviewView';
import { RegionalPalayView } from './components/views/RegionalPalayView';
import { SeedPerformanceView } from './components/views/SeedPerformanceView';
import { DamageReportView } from './components/views/DamageReportView';
import { InsightsProjectView } from './components/views/InsightsProjectView';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Overview shared filters
  const [overviewRegion, setOverviewRegion] = useState<'all' | RegionId>('all');
  const [yearRange, setYearRange] = useState<[number, number]>([2021, 2025]);

  // Regional Palay view filters
  const [palayRegionFilter, setPalayRegionFilter] = useState<
    'all' | 'central-luzon' | 'cagayan-valley'
  >('all');
  const [palaySeverityFilter, setPalaySeverityFilter] = useState<
    'all' | 'normal' | 'onset' | 'severe' | 'recovery'
  >('all');
  const [palaySearch, setPalaySearch] = useState('');

  // Seed Performance view filters
  const [seedToleranceFilter, setSeedToleranceFilter] = useState<
    'all' | DroughtToleranceLevel
  >('all');
  const [seedAreaFilter, setSeedAreaFilter] = useState<'all' | GrowingAreaType>('all');
  const [seedSearch, setSeedSearch] = useState('');

  // El Niño Damage view filters
  const [damageRegionFilter, setDamageRegionFilter] = useState<'all' | RegionId>('all');
  const [damageSearch, setDamageSearch] = useState('');

  const handleExportCsv = () => {
    let filename = 'seeds-of-survival.csv';
    let csv = '';

    if (activeTab === 'palay') {
      filename = 'regional-palay-stats.csv';
      const rows = filterRegionalPalayStats(REGIONAL_PALAY_STATS, {
        regionFilter: palayRegionFilter,
        severityFilter: palaySeverityFilter,
        searchQuery: palaySearch,
      });
      csv = buildCsvContent(
        [
          'Region',
          'Year',
          'Climate Condition',
          'Area Harvested (ha)',
          'Production (MT)',
          'Average Yield (t/ha)',
        ],
        rows.map((r) => [
          r.region,
          r.year,
          r.climateCondition,
          r.areaHarvestedHa,
          r.productionMt,
          r.averageYieldTha.toFixed(2),
        ]),
      );
    } else if (activeTab === 'seeds') {
      filename = 'seed-performance-philrice.csv';
      const rows = filterSeedPerformance(SEED_PERFORMANCE_DATA, {
        toleranceFilter: seedToleranceFilter,
        areaFilter: seedAreaFilter,
        searchQuery: seedSearch,
      });
      csv = buildCsvContent(
        [
          'Seed Code',
          'Seed Name',
          'Growing Area',
          'Days to Harvest',
          'Average Harvest in Rainfed Areas (t/ha)',
          'Highest Possible Harvest (t/ha)',
          'Ability to Survive Drought',
        ],
        rows.map((r) => [
          r.seedCode,
          r.seedName,
          r.growingArea,
          r.daysToHarvest,
          r.avgRainfedHarvestTha.toFixed(2),
          r.highestPossibleHarvestTha.toFixed(2),
          r.droughtTolerance,
        ]),
      );
    } else if (activeTab === 'damage') {
      filename = 'el-nino-damage-report.csv';
      const rows = filterDamageReport(EL_NINO_DAMAGE_REPORT, {
        regionFilter: damageRegionFilter,
        searchQuery: damageSearch,
      });
      csv = buildCsvContent(
        [
          'Region',
          'Affected Farmers',
          'Damaged Area (ha)',
          'Production Loss (MT)',
          'Financial Loss (PHP)',
        ],
        rows.map((r) => [
          r.region,
          r.affectedFarmers,
          r.damagedAreaHa,
          r.productionLossMt,
          r.financialLossPhp,
        ]),
      );
    } else if (activeTab === 'insights') {
      filename = 'insights-recommendations-summary.csv';
      csv = buildCsvContent(
        ['Topic', 'Metric', 'Key Findings', 'Recommendations / Actions Needed'],
        INSIGHTS_SUMMARY.map((i) => [
          `${i.number}. ${i.topic}`,
          i.headlineMetric,
          i.keyFindings,
          i.recommendations,
        ]),
      );
    } else {
      filename = 'el-nino-regional-damage-overview.csv';
      const rows = filterDamageReport(EL_NINO_DAMAGE_REPORT, {
        regionFilter: overviewRegion,
      });
      csv = buildCsvContent(
        [
          'Region',
          'Affected Farmers',
          'Damaged Area (ha)',
          'Production Loss (MT)',
          'Financial Loss (PHP)',
        ],
        rows.map((r) => [
          r.region,
          r.affectedFarmers,
          r.damagedAreaHa,
          r.productionLossMt,
          r.financialLossPhp,
        ]),
      );
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    window.setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="relative min-h-screen text-slate-900 flex flex-col lg:flex-row">
      {/* Rice Farm Background Layer with Atmospheric Readability Scrim */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-[#dce6d5] via-[#eef2e6] to-[#e9e3ce] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={riceFarmBackdrop}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[#F4F6F0]/72 backdrop-blur-[1.5px]" />
      </div>

      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-[252px] flex flex-col min-w-0">
        <TopBar
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onExportCsv={handleExportCsv}
          exportSuccess={exportSuccess}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              selectedRegion={overviewRegion}
              onSelectRegion={setOverviewRegion}
              yearRange={yearRange}
              onChangeYearRange={setYearRange}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'palay' && (
            <RegionalPalayView
              regionFilter={palayRegionFilter}
              onChangeRegionFilter={setPalayRegionFilter}
              severityFilter={palaySeverityFilter}
              onChangeSeverityFilter={setPalaySeverityFilter}
              searchQuery={palaySearch}
              onChangeSearchQuery={setPalaySearch}
            />
          )}

          {activeTab === 'seeds' && (
            <SeedPerformanceView
              toleranceFilter={seedToleranceFilter}
              onChangeToleranceFilter={setSeedToleranceFilter}
              areaFilter={seedAreaFilter}
              onChangeAreaFilter={setSeedAreaFilter}
              searchQuery={seedSearch}
              onChangeSearchQuery={setSeedSearch}
            />
          )}

          {activeTab === 'damage' && (
            <DamageReportView
              selectedRegion={damageRegionFilter}
              onSelectRegion={setDamageRegionFilter}
              searchQuery={damageSearch}
              onChangeSearchQuery={setDamageSearch}
            />
          )}

          {activeTab === 'insights' && <InsightsProjectView />}
        </main>

        <footer className="mt-auto border-t border-slate-200/80 bg-white/90 backdrop-blur-xs px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">Developed by {DEVELOPMENT_TEAM_INFO.group}</span>
              <span className="mx-1.5 text-slate-300" aria-hidden="true">·</span>
              <span className="font-medium text-[#14452F]">{DEVELOPMENT_TEAM_INFO.courseSection}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                <strong className="font-semibold text-slate-800">Group Leader:</strong> {DEVELOPMENT_TEAM_INFO.leader}
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <span>
                <strong className="font-semibold text-slate-800">Members:</strong> {DEVELOPMENT_TEAM_INFO.members.join(', ')}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
