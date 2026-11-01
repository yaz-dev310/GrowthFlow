
import {
  LayoutDashboard,
  Users,
  Megaphone,
  ChartNoAxesCombined,
  UserRound,
  Settings,
  LogOut,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type SidebarProps = {
  activePage: string;
  onNavigate: (path: string) => void;
};

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { label: t("navigation.dashboard"), icon: LayoutDashboard, path: "/" },
    { label: t("navigation.clients"), icon: Users, path: "/clients" },
    { label: t("navigation.campaigns"), icon: Megaphone, path: "/campaigns" },
    { label: t("navigation.analytics"), icon: ChartNoAxesCombined, path: "/analytics" },
    { label: t("navigation.leads"), icon: UserRound, path: "/leads" },
  ];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-[#111827] px-4 py-6">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-blue-600/20">
          <TrendingUp size={24} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            GrowthFlow
          </h1>
          <p className="text-xs text-slate-500">
            {t("sidebar.platform")}
          </p>
        </div>
      </div>

      {/* Workspace */}
      <div className="mb-4 px-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {t("sidebar.workspace")}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span
                className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition ${
                  isActive ? "bg-blue-500" : "bg-transparent"
                }`}
              />

              <span className="flex items-center gap-3">
                <Icon
                  size={19}
                  className={`transition ${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-white"
                  }`}
                />
                {item.label}
              </span>

              {isActive && (
                <ChevronRight size={16} className="text-blue-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-slate-800 py-4">
        <button
          type="button"
          onClick={() => onNavigate("/settings")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            activePage === "/settings"
              ? "bg-blue-600/15 text-blue-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Settings size={19} />
          {t("navigation.settings")}
        </button>
      </div>

      {/* User profile */}
      <div className="border-t border-slate-800 pt-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            YA
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Yazid Agnide
            </p>
            <p className="text-xs text-slate-500">
              {t("sidebar.administrator")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("/login")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          {t("header.logout")}
        </button>
      </div>
    </aside>
  );
}
