
import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  X,
  CheckCheck,
  Activity,
  PlusCircle,
  Pencil,
  Trash2,
  Clock,
  Check,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getActivities,
  getReadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Activity as ActivityType,
} from "../utils/activityLogger";

type HeaderProps = {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

function formatDate(date: string, language: string) {
  const activityDate = new Date(date);

  if (Number.isNaN(activityDate.getTime())) {
    return "";
  }

  const locales: Record<string, string> = {
    fr: "fr-FR",
    en: "en-GB",
    es: "es-ES",
    de: "de-DE",
  };

  return new Intl.DateTimeFormat(locales[language] || "fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(activityDate);
}

function getActionIcon(action: ActivityType["action"]) {
  switch (action) {
    case "created":
      return PlusCircle;
    case "updated":
      return Pencil;
    case "deleted":
      return Trash2;
    default:
      return Activity;
  }
}

export default function Header({
  title,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [activities, setActivities] = useState<ActivityType[]>(() =>
    getActivities()
  );

  const [readIds, setReadIds] = useState<number[]>(() =>
    getReadNotifications()
  );

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage || "fr";

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("growthflow_language", language);
  };

  const pageTitles: Record<string, string> = {
    Dashboard: t("navigation.dashboard"),
    "Gestion des clients": t("navigation.clients"),
    "Campagnes marketing": t("navigation.campaigns"),
    Analytics: t("navigation.analytics"),
    "Gestion des leads": t("navigation.leads"),
    Paramètres: t("navigation.settings"),
  };

  const subtitles: Record<string, string> = {
    Dashboard: t("header.subtitles.dashboard"),
    "Gestion des clients": t("header.subtitles.clients"),
    "Campagnes marketing": t("header.subtitles.campaigns"),
    Analytics: t("header.subtitles.analytics"),
    "Gestion des leads": t("header.subtitles.leads"),
    Paramètres: t("header.subtitles.settings"),
  };

  const getTypeLabel = (type: ActivityType["type"]) => {
    switch (type) {
      case "client":
        return t("header.activityTypes.client");
      case "campaign":
        return t("header.activityTypes.campaign");
      case "lead":
        return t("header.activityTypes.lead");
      default:
        return t("header.activityTypes.other");
    }
  };

  useEffect(() => {
    const refreshActivities = () => {
      setActivities(getActivities());
      setReadIds(getReadNotifications());
    };

    window.addEventListener("focus", refreshActivities);
    const interval = window.setInterval(refreshActivities, 2000);

    return () => {
      window.removeEventListener("focus", refreshActivities);
      window.clearInterval(interval);
    };
  }, []);

  const unreadCount = activities.filter(
    (activity) => !readIds.includes(activity.id)
  ).length;

  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
    setReadIds(getReadNotifications());
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setReadIds(getReadNotifications());
  };

  const handleDelete = (id: number) => {
    deleteNotification(id);
    setActivities(getActivities());
    setReadIds(getReadNotifications());
  };

  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 bg-[#0B1020] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          {pageTitles[title] || title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {subtitles[title] || t("header.subtitles.default")}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-[#111827] px-3 py-2 sm:flex-none">
          <Search size={18} className="shrink-0 text-slate-400" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("header.search")}
            aria-label={t("header.search")}
            className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-40 lg:w-52"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label={t("header.clearSearch")}
              className="text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-[#111827] px-2.5 py-2">
          <Globe size={17} className="text-blue-400" />

          <select
            value={currentLanguage}
            onChange={(event) => changeLanguage(event.target.value)}
            aria-label={t("header.language")}
            className="max-w-24 cursor-pointer bg-transparent text-sm text-white outline-none"
          >
            <option value="fr" className="bg-[#111827]">
              🇫🇷 FR
            </option>
            <option value="en" className="bg-[#111827]">
              🇬🇧 EN
            </option>
            <option value="es" className="bg-[#111827]">
              🇪🇸 ES
            </option>
            <option value="de" className="bg-[#111827]">
              🇩🇪 DE
            </option>
          </select>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={t("header.notificationCount", {
              count: unreadCount,
            })}
            aria-expanded={notificationsOpen}
            className="relative rounded-xl border border-slate-700 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-[#0B1020]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
                <div>
                  <h3 className="font-semibold text-white">
                    {t("header.notifications")}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {t("header.unreadCount", {
                      count: unreadCount,
                    })}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1.5 text-xs text-blue-400 transition hover:text-blue-300"
                  >
                    <CheckCheck size={15} />
                    {t("header.markAllRead")}
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.slice(0, 10).map((activity) => {
                    const ActionIcon = getActionIcon(activity.action);
                    const isRead = readIds.includes(activity.id);

                    return (
                      <div
                        key={activity.id}
                        className={`flex gap-3 border-b border-slate-800 px-4 py-3 last:border-0 ${
                          isRead ? "opacity-60" : "bg-blue-500/5"
                        }`}
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
                          <ActionIcon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed text-slate-200">
                            {activity.description}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>{getTypeLabel(activity.type)}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {formatDate(activity.date, currentLanguage)}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            {!isRead && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkAsRead(activity.id)
                                }
                                className="flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-300"
                              >
                                <Check size={13} />
                                {t("header.markRead")}
                              </button>
                            )}

                            {isRead && (
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Check size={13} />
                                {t("header.read")}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(activity.id)}
                              aria-label={t("header.deleteNotification")}
                              className="flex items-center gap-1 text-xs text-red-400 transition hover:text-red-300"
                            >
                              <Trash2 size={13} />
                              {t("common.delete")}
                            </button>
                          </div>
                        </div>

                        {!isRead && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-10 text-center">
                    <Bell
                      size={28}
                      className="mx-auto mb-3 text-slate-600"
                    />
                    <p className="text-sm text-slate-400">
                      {t("header.emptyNotifications")}
                    </p>
                  </div>
                )}
              </div>

              {activities.length > 0 && (
                <div className="border-t border-slate-700 p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/");
                    }}
                    className="w-full rounded-lg py-2 text-center text-sm text-blue-400 transition hover:bg-slate-800"
                  >
                    {t("header.viewDashboard")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label={t("header.profile")}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              YA
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-slate-700 bg-[#111827] shadow-xl">
              <div className="border-b border-slate-700 px-4 py-3">
                <p className="text-sm font-semibold text-white">
                  {t("header.profile")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {t("header.administrator")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <Settings size={16} />
                {t("navigation.settings")}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex w-full items-center gap-3 border-t border-slate-700 px-4 py-3 text-sm text-red-400 transition hover:bg-slate-800"
              >
                <LogOut size={16} />
                {t("header.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
