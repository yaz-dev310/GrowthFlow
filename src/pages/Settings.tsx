
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  UserRound,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";

type SettingsData = {
  agency: string;
  email: string;
  notifications: boolean;
};

const defaultSettings: SettingsData = {
  agency: "GrowthFlow Agency",
  email: "contact@growthflow.com",
  notifications: true,
};

export default function Settings() {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<SettingsData>(() => {
    try {
      const savedSettings = localStorage.getItem("growthflow_settings");

      return savedSettings
        ? { ...defaultSettings, ...JSON.parse(savedSettings) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "growthflow_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const handleSave = () => {
    localStorage.setItem(
      "growthflow_settings",
      JSON.stringify(settings)
    );

    setMessage(t("settings.success"));

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">
          {t("settings.heading")}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {t("settings.description")}
        </p>
      </div>

      {/* Agency information */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <div className="mb-6 flex items-center gap-3">
          <Building2 className="text-blue-400" size={22} />
          <div>
            <h4 className="font-semibold text-white">
              {t("settings.agency.title")}
            </h4>
            <p className="text-sm text-slate-400">
              {t("settings.agency.description")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              {t("settings.agency.name")}
            </span>
            <input
              value={settings.agency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  agency: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              {t("settings.agency.email")}
            </span>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="text-blue-400" size={22} />
          <div>
            <h4 className="font-semibold text-white">
              {t("settings.account.title")}
            </h4>
            <p className="text-sm text-slate-400">
              {t("settings.account.description")}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          {t("settings.account.role")}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {t("settings.account.notice")}
        </p>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <div className="mb-5 flex items-center gap-3">
          <Bell className="text-blue-400" size={22} />
          <div>
            <h4 className="font-semibold text-white">
              {t("settings.notifications.title")}
            </h4>
            <p className="text-sm text-slate-400">
              {t("settings.notifications.description")}
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="text-sm text-slate-300">
            {t("settings.notifications.receive")}
          </span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: e.target.checked,
              })
            }
            className="h-5 w-5 accent-blue-500"
          />
        </label>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-400" size={22} />
          <div>
            <h4 className="font-semibold text-white">
              {t("settings.security.title")}
            </h4>
            <p className="text-sm text-slate-400">
              {t("settings.security.description")}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Save size={18} />
          {t("settings.save")}
        </button>

        {message && (
          <p className="text-sm text-emerald-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
