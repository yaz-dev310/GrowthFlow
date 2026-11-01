
import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitles: Record<string, string> = {
    "/": t("navigation.dashboard"),
    "/clients": t("navigation.clients"),
    "/campaigns": t("navigation.campaigns"),
    "/analytics": t("navigation.analytics"),
    "/leads": t("navigation.leads"),
    "/settings": t("navigation.settings"),
  };

  const title = pageTitles[location.pathname] || "GrowthFlow";

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-[#0B1020] text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activePage={location.pathname}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label={t("common.close")}
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative z-10 h-full w-72">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-3 z-20 rounded-lg bg-slate-800 p-2"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>

            <Sidebar
              activePage={location.pathname}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
            aria-label={t("header.menu")}
          >
            <Menu size={22} />
          </button>

          <span className="font-semibold">GrowthFlow</span>
        </div>

        <Header
          title={title}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet
            context={{
              searchQuery,
            }}
          />
        </div>
      </main>
    </div>
  );
}
