export type RegionId =
  | 'central-luzon'
  | 'cagayan-valley'
  | 'ilocos'
  | 'western-visayas';

export type DroughtToleranceLevel = 'High' | 'Moderate-High' | 'Moderate' | 'Low';
export type GrowingAreaType = 'Rainfed Lowland' | 'Upland';

export interface ProjectOverviewItem {
  part: string;
  details: string;
}

export interface ProjectMember {
  role: string;
  name: string;
  responsibility: string;
}

export interface RegionalPalayRow {
  id: string;
  regionId: 'central-luzon' | 'cagayan-valley';
  region: string;
  shortRegion: string;
  year: number;
  climateCondition: string;
  climateSeverity: 'normal' | 'onset' | 'severe' | 'recovery';
  areaHarvestedHa: number;
  productionMt: number;
  averageYieldTha: number;
}

export interface SeedPerformanceRow {
  id: string;
  seedCode: string;
  seedName: string;
  growingArea: GrowingAreaType;
  daysToHarvest: number;
  avgRainfedHarvestTha: number;
  highestPossibleHarvestTha: number;
  droughtTolerance: DroughtToleranceLevel;
  isTraditional: boolean;
}

export interface ElNinoDamageRow {
  id: string;
  regionId: RegionId;
  region: string;
  shortRegion: string;
  affectedFarmers: number;
  damagedAreaHa: number;
  productionLossMt: number;
  financialLossPhp: number;
}

export interface InsightRow {
  id: string;
  number: number;
  topic: string;
  headlineMetric: string;
  keyFindings: string;
  recommendations: string;
  category: 'yield' | 'seed' | 'financial' | 'maturity';
}

export interface ReferenceSource {
  id: string;
  source: string;
  reportName: string;
  officialUrl: string;
}

export const PROJECT_TITLE =
  "Seeds of Survival: Understanding Filipino Farmers' Experiences and Challenges in Accessing Drought-Tolerant Rice Seeds During El Niño";

export const PROJECT_OVERVIEW_ITEMS: ProjectOverviewItem[] = [
  {
    part: 'Project Title',
    details: PROJECT_TITLE,
  },
  {
    part: 'Study Coverage',
    details: 'Agricultural (Central Luzon - Region III & Cagayan Valley - Region II)',
  },
  {
    part: 'Total Financial Loss',
    details: 'PHP 8.435 billion in losses in major rice-producing regions.',
  },
  {
    part: 'Affected Farmers',
    details: '107,970 registered rice farmers.',
  },
  {
    part: 'Damaged Farmland',
    details: '125,450 hectares of farmland.',
  },
  {
    part: 'Lowest Rice Harvest During El Niño',
    details: 'Rice harvest in Central Luzon dropped by 20%, from 5.25 tons/ha in 2021 to 4.20 tons/ha in 2024.',
  },
  {
    part: 'Seed Yield Advantage',
    details: 'PhilRice drought-resistant seeds produced 3.43 tons/ha, while traditional seeds produced 2.10 tons/ha in rainfed areas.',
  },
];

export const PROJECT_MEMBERS: ProjectMember[] = [
  {
    role: 'Engagement Lead',
    name: 'SAQUIAN, Khizzen Mae',
    responsibility: 'Team Lead & Overall Coordination',
  },
  {
    role: 'Data Analyst',
    name: 'ISIP, Divine Grace',
    responsibility: 'Data Collection & Validation (PSA / PhilRice / DA)',
  },
  {
    role: 'Insights / Modeling Analyst',
    name: 'TALIDONG, Alphy',
    responsibility: 'Business Analytics & Diagnostic Modeling',
  },
  {
    role: 'Visualization & Strategy Lead',
    name: 'CANUA, Hanz Emmerson',
    responsibility: 'Excel Dashboard & Chart Design',
  },
];

export const DEVELOPMENT_TEAM_INFO = {
  group: 'Group 5',
  courseSection: 'BSINFOTECH 2A',
  leader: 'Isip',
  members: ['Canua', 'Saquian', 'Talidong'],
} as const;

export const REGIONAL_PALAY_STATS: RegionalPalayRow[] = [
  {
    id: 'cl-2021',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    year: 2021,
    climateCondition: 'Normal / Mild Wet',
    climateSeverity: 'normal',
    areaHarvestedHa: 712340,
    productionMt: 3741200,
    averageYieldTha: 5.25,
  },
  {
    id: 'cl-2022',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    year: 2022,
    climateCondition: 'Normal',
    climateSeverity: 'normal',
    areaHarvestedHa: 708900,
    productionMt: 3615400,
    averageYieldTha: 5.10,
  },
  {
    id: 'cl-2023',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    year: 2023,
    climateCondition: 'El Niño Onset',
    climateSeverity: 'onset',
    areaHarvestedHa: 695400,
    productionMt: 3337920,
    averageYieldTha: 4.80,
  },
  {
    id: 'cl-2024',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    year: 2024,
    climateCondition: 'Severe El Niño Drought',
    climateSeverity: 'severe',
    areaHarvestedHa: 642100,
    productionMt: 2696820,
    averageYieldTha: 4.20,
  },
  {
    id: 'cl-2025',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    year: 2025,
    climateCondition: 'Post-El Niño Recovery',
    climateSeverity: 'recovery',
    areaHarvestedHa: 685000,
    productionMt: 3288000,
    averageYieldTha: 4.80,
  },
  {
    id: 'cv-2021',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    year: 2021,
    climateCondition: 'Normal / Mild Wet',
    climateSeverity: 'normal',
    areaHarvestedHa: 532100,
    productionMt: 2554080,
    averageYieldTha: 4.80,
  },
  {
    id: 'cv-2022',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    year: 2022,
    climateCondition: 'Normal',
    climateSeverity: 'normal',
    areaHarvestedHa: 528400,
    productionMt: 2457060,
    averageYieldTha: 4.65,
  },
  {
    id: 'cv-2023',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    year: 2023,
    climateCondition: 'El Niño Onset',
    climateSeverity: 'onset',
    areaHarvestedHa: 515000,
    productionMt: 2240250,
    averageYieldTha: 4.35,
  },
  {
    id: 'cv-2024',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    year: 2024,
    climateCondition: 'Severe El Niño Drought',
    climateSeverity: 'severe',
    areaHarvestedHa: 472300,
    productionMt: 1771125,
    averageYieldTha: 3.75,
  },
  {
    id: 'cv-2025',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    year: 2025,
    climateCondition: 'Post-El Niño Recovery',
    climateSeverity: 'recovery',
    areaHarvestedHa: 505000,
    productionMt: 2222000,
    averageYieldTha: 4.40,
  },
];

export const SEED_PERFORMANCE_DATA: SeedPerformanceRow[] = [
  {
    id: 'nsic-rc480',
    seedCode: 'NSIC Rc480',
    seedName: 'Tubigan 48',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 107,
    avgRainfedHarvestTha: 3.80,
    highestPossibleHarvestTha: 4.40,
    droughtTolerance: 'High',
    isTraditional: false,
  },
  {
    id: 'nsic-rc192',
    seedCode: 'NSIC Rc192',
    seedName: 'Sahod Ulan 1',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 106,
    avgRainfedHarvestTha: 3.70,
    highestPossibleHarvestTha: 5.50,
    droughtTolerance: 'High',
    isTraditional: false,
  },
  {
    id: 'psb-rc14',
    seedCode: 'PSB Rc14',
    seedName: 'Rio Grande',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 110,
    avgRainfedHarvestTha: 3.50,
    highestPossibleHarvestTha: 6.10,
    droughtTolerance: 'Moderate-High',
    isTraditional: false,
  },
  {
    id: 'psb-rc68',
    seedCode: 'PSB Rc68',
    seedName: 'Sacobia',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 116,
    avgRainfedHarvestTha: 3.10,
    highestPossibleHarvestTha: 4.40,
    droughtTolerance: 'Moderate',
    isTraditional: false,
  },
  {
    id: 'psb-rc80',
    seedCode: 'PSB Rc80',
    seedName: 'Pasig',
    growingArea: 'Upland',
    daysToHarvest: 112,
    avgRainfedHarvestTha: 3.20,
    highestPossibleHarvestTha: 8.70,
    droughtTolerance: 'High',
    isTraditional: false,
  },
  {
    id: 'nsic-rc23',
    seedCode: 'NSIC Rc23',
    seedName: 'Sinag',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 108,
    avgRainfedHarvestTha: 3.30,
    highestPossibleHarvestTha: 5.00,
    droughtTolerance: 'Moderate-High',
    isTraditional: false,
  },
  {
    id: 'traditional-local',
    seedCode: 'Traditional / Local',
    seedName: 'Local Inbred Variety',
    growingArea: 'Rainfed Lowland',
    daysToHarvest: 125,
    avgRainfedHarvestTha: 2.10,
    highestPossibleHarvestTha: 3.20,
    droughtTolerance: 'Low',
    isTraditional: true,
  },
];

export const EL_NINO_DAMAGE_REPORT: ElNinoDamageRow[] = [
  {
    id: 'dmg-cl',
    regionId: 'central-luzon',
    region: 'Central Luzon (Region III)',
    shortRegion: 'Central Luzon (III)',
    affectedFarmers: 28450,
    damagedAreaHa: 32150,
    productionLossMt: 84200,
    financialLossPhp: 2145000000,
  },
  {
    id: 'dmg-cv',
    regionId: 'cagayan-valley',
    region: 'Cagayan Valley (Region II)',
    shortRegion: 'Cagayan Valley (II)',
    affectedFarmers: 34120,
    damagedAreaHa: 41800,
    productionLossMt: 112500,
    financialLossPhp: 2860000000,
  },
  {
    id: 'dmg-ir',
    regionId: 'ilocos',
    region: 'Ilocos Region (Region I)',
    shortRegion: 'Ilocos Region (I)',
    affectedFarmers: 19800,
    damagedAreaHa: 22400,
    productionLossMt: 58000,
    financialLossPhp: 1480000000,
  },
  {
    id: 'dmg-wv',
    regionId: 'western-visayas',
    region: 'Western Visayas (Region VI)',
    shortRegion: 'Western Visayas (VI)',
    affectedFarmers: 25600,
    damagedAreaHa: 29100,
    productionLossMt: 76400,
    financialLossPhp: 1950000000,
  },
];

export const INSIGHTS_SUMMARY: InsightRow[] = [
  {
    id: 'insight-1',
    number: 1,
    topic: 'Yield Impact',
    headlineMetric: '-20%',
    keyFindings: 'Rice harvest dropped by 20% in Region III and 21.9% in Region II in 2024.',
    recommendations: 'Give farmers help before the drought gets worse.',
    category: 'yield',
  },
  {
    id: 'insight-2',
    number: 2,
    topic: 'Seed Gap',
    headlineMetric: '+63%',
    keyFindings: 'PhilRice seeds produced 3.43 tons per hectare, while traditional seeds produced 2.10 tons.',
    recommendations: 'Encourage farmers to use seeds that can survive with less water.',
    category: 'seed',
  },
  {
    id: 'insight-3',
    number: 3,
    topic: 'Financial Loss',
    headlineMetric: '₱8.4B',
    keyFindings: 'Drought caused ₱8.435 billion in losses and affected 107,970 farmers and 125,450 hectares of farmland.',
    recommendations: 'Give farmers seeds and financial help before drought starts.',
    category: 'financial',
  },
  {
    id: 'insight-4',
    number: 4,
    topic: 'Maturity Advantage',
    headlineMetric: '106–110 days',
    keyFindings: 'Some rice types can be harvested in 106–110 days, while traditional types take around 125 days.',
    recommendations: 'Encourage farmers to plant rice that grows and can be harvested faster.',
    category: 'maturity',
  },
];

export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    id: 'ref-psa',
    source: 'Philippine Statistics Authority (PSA)',
    reportName: 'Palay Production Statistics (OpenSTAT)',
    officialUrl: 'https://openstat.psa.gov.ph/',
  },
  {
    id: 'ref-philrice',
    source: 'Philippine Rice Research Institute (DA-PhilRice)',
    reportName: 'Drought-Tolerant Seed (RCEF)',
    officialUrl: 'https://www.philrice.gov.ph/',
  },
  {
    id: 'ref-da',
    source: 'Department of Agriculture – DRRM Center',
    reportName: 'El Niño Agricultural Loss Bulletins',
    officialUrl: 'https://www.da.gov.ph/',
  },
];
