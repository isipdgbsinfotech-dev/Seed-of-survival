import {
  BarChart3,
  CloudRainWind,
  FileSpreadsheet,
  Lightbulb,
  Sprout,
  Wheat,
  X,
} from 'lucide-react';

export type DashboardTabId =
  | 'overview'
  | 'palay'
  | 'seeds'
  | 'damage'
  | 'insights';

export interface NavItem {
  id: DashboardTabId;
  label: string;
  subtitle: string;
  icon: typeof BarChart3;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    subtitle: 'Visual analytics & KPIs',
    icon: BarChart3,
  },
  {
    id: 'palay',
    label: 'Regional Palay',
    subtitle: 'PSA OpenSTAT 2021–2025',
    icon: Wheat,
  },
  {
    id: 'seeds',
    label: 'Seed Performance',
    subtitle: 'DA-PhilRice varieties',
    icon: Sprout,
  },
  {
    id: 'damage',
    label: 'El Niño Damage',
    subtitle: 'DA-DRRM loss report',
    icon: CloudRainWind,
  },
  {
    id: 'insights',
    label: 'Insights & Project',
    subtitle: 'Findings, team & sources',
    icon: Lightbulb,
  },
];

interface SidebarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (tab: DashboardTabId) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-white/95 backdrop-blur-sm border-r border-slate-200">
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14452F] text-white shrink-0">
            <Sprout className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-display text-sm font-bold tracking-tight text-slate-900 block truncate">
              Seeds of Survival
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Primary dashboard sections" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F] ${
                isActive
                  ? 'bg-[#14452F] text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold leading-tight whitespace-nowrap truncate">
                  {item.label}
                </div>
                <div
                  className={`text-xs leading-tight mt-0.5 truncate ${
                    isActive ? 'text-emerald-100/85' : 'text-slate-500'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-200 text-xs text-slate-600 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#14452F] shrink-0" aria-hidden="true" />
            <span>Dataset Sources</span>
          </div>
          <p className="leading-relaxed text-slate-500">
            PSA OpenSTAT · DA-PhilRice · DA-DRRM Center (2021–2025)
          </p>
        </div>

        <div className="pt-2.5 border-t border-slate-100 space-y-0.5">
          <div className="font-semibold text-slate-800">Developed by Group 5</div>
          <div className="text-slate-600">BSINFOTECH 2A</div>
          <div className="text-[11px] text-slate-500">
            Leader: Isip · Canua, Saquian, Talidong
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-[252px] lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="fixed inset-0 bg-slate-900/40 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-[272px] max-w-[85vw] z-10 shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
