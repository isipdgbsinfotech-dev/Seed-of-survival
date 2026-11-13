import { Check, Download, Menu } from 'lucide-react';
import { NAV_ITEMS, type DashboardTabId } from './Sidebar';

interface TopBarProps {
  activeTab: DashboardTabId;
  onOpenMobileMenu: () => void;
  onExportCsv: () => void;
  exportSuccess: boolean;
}

export function TopBar({
  activeTab,
  onOpenMobileMenu,
  onExportCsv,
  exportSuccess,
}: TopBarProps) {
  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden inline-flex items-center justify-center h-11 w-11 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F] shrink-0"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline font-medium text-slate-500 whitespace-nowrap shrink-0">
            Seeds of Survival
          </span>
          <span className="hidden sm:inline text-slate-300 shrink-0" aria-hidden="true">
            /
          </span>
          <h1 className="font-display text-base sm:text-lg font-semibold text-slate-900 truncate">
            {currentNav.label}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#14452F] text-white text-xs sm:text-sm font-medium hover:bg-[#0f3624] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14452F]"
        >
          {exportSuccess ? (
            <>
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Exported CSV</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
