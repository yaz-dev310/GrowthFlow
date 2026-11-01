
import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Wallet,
  Megaphone,
  UserRound,
  MousePointerClick,
  Activity,
  PlusCircle,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { getActivities } from "../utils/activityLogger";
import type { Activity as ActivityType } from "../utils/activityLogger";

type Client = {
  id: number;
  name: string;
  sector: string;
  campaigns: number;
  status: string;
};

type Campaign = {
  id: number;
  name: string;
  channel: string;
  budget: number;
  status: string;
};

type Lead = {
  id: number;
  name: string;
  company: string;
  source: string;
  status: string;
};

type DashboardData = {
  clients: Client[];
  campaigns: Campaign[];
  leads: Lead[];
  activities: ActivityType[];
};

const chartData = [
  { month: "jan", revenue: 12000 },
  { month: "feb", revenue: 15000 },
  { month: "mar", revenue: 18000 },
  { month: "apr", revenue: 16000 },
  { month: "may", revenue: 22000 },
  { month: "jun", revenue: 25000 },
  { month: "jul", revenue: 28000 },
  { month: "aug", revenue: 32000 },
  { month: "sep", revenue: 38000 },
];

const leadStatuses = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Converti",
  "Perdu",
];

const leadSources = [
  "Site web",
  "LinkedIn",
  "Publicité",
  "Recommandation",
  "Autre",
];

function getStoredData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T[]) : [];
  } catch {
    return [];
  }
}

function getDashboardData(): DashboardData {
  return {
    clients: getStoredData<Client>("growthflow_clients"),
    campaigns: getStoredData<Campaign>("growthflow_campaigns"),
    leads: getStoredData<Lead>("growthflow_leads"),
    activities: getActivities(),
  };
}

function getActivityIcon(activity: ActivityType) {
  if (activity.action === "created") {
    return <PlusCircle size={16} />;
  }

  if (activity.action === "updated") {
    return <Pencil size={16} />;
  }

  return <Trash2 size={16} />;
}

function getActivityStyle(type: ActivityType["type"]) {
  if (type === "client") {
    return "bg-blue-500/10 text-blue-400";
  }

  if (type === "campaign") {
    return "bg-purple-500/10 text-purple-400";
  }

  return "bg-emerald-500/10 text-emerald-400";
}

export default function Overview() {
  const { t, i18n } = useTranslation();

  const [dashboard, setDashboard] = useState<DashboardData>(
    getDashboardData
  );

  useEffect(() => {
    const refreshDashboard = () => {
      setDashboard(getDashboardData());
    };

    refreshDashboard();

    window.addEventListener(
      "growthflow:data-updated",
      refreshDashboard
    );

    window.addEventListener("focus", refreshDashboard);

    return () => {
      window.removeEventListener(
        "growthflow:data-updated",
        refreshDashboard
      );

      window.removeEventListener("focus", refreshDashboard);
    };
  }, []);

  const { clients, campaigns, leads, activities } = dashboard;

  const localeMap: Record<string, string> = {
    fr: "fr-FR",
    en: "en-GB",
    es: "es-ES",
    de: "de-DE",
  };

  const locale =
    localeMap[i18n.language.split("-")[0]] || "fr-FR";

  const getLeadStatusLabel = (status: string) => {
    const index = leadStatuses.indexOf(status);

    return index !== -1
      ? t(`leads.statuses.${index}`)
      : status;
  };

  const getLeadSourceLabel = (source: string) => {
    const index = leadSources.indexOf(source);

    return index !== -1
      ? t(`leads.sources.${index}`)
      : source;
  };

  const getCampaignStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      "Planifiée": t("campaigns.planned"),
      "En cours": t("campaigns.inProgress"),
      "Terminée": t("campaigns.completed"),
    };

    return statusLabels[status] || status;
  };

  const getActivityLabel = (activity: ActivityType) => {
    const patterns = [
      {
        regex: /^Nouveau client ajouté\s*:\s*(.+)$/i,
        key: "overview.activities.clientCreated",
      },
      {
        regex: /^Client\s+(.+)\s+modifié$/i,
        key: "overview.activities.clientUpdated",
      },
      {
        regex: /^Client\s+(.+)\s+supprimé$/i,
        key: "overview.activities.clientDeleted",
      },
      {
        regex: /^Nouvelle campagne ajoutée\s*:\s*(.+)$/i,
        key: "overview.activities.campaignCreated",
      },
      {
        regex: /^Campagne\s+(.+)\s+modifiée$/i,
        key: "overview.activities.campaignUpdated",
      },
      {
        regex: /^Campagne\s+(.+)\s+supprimée$/i,
        key: "overview.activities.campaignDeleted",
      },
      {
        regex: /^Nouveau lead ajouté\s*:\s*(.+)$/i,
        key: "overview.activities.leadCreated",
      },
      {
        regex: /^Lead\s+(.+)\s+modifié$/i,
        key: "overview.activities.leadUpdated",
      },
      {
        regex: /^Lead\s+(.+)\s+supprimé$/i,
        key: "overview.activities.leadDeleted",
      },
    ];

    for (const pattern of patterns) {
      const match = activity.description.match(pattern.regex);

      if (match) {
        return t(pattern.key, { name: match[1] });
      }
    }

    const actionKey = {
      created: "created",
      updated: "updated",
      deleted: "deleted",
    }[activity.action];

    return t(`overview.activities.generic.${activity.type}.${actionKey}`);
  };

  const convertedLeads = leads.filter((lead) => {
    const status = lead.status.trim().toLowerCase();

    return [
      "converti",
      "converted",
      "convertido",
      "konvertiert",
    ].includes(status);
  }).length;

  const conversionRate =
    leads.length > 0
      ? Math.round((convertedLeads / leads.length) * 100)
      : 0;

  const recentCampaigns = [...campaigns].slice(-3).reverse();
  const recentLeads = [...leads].slice(-4).reverse();
  const recentActivities = activities.slice(0, 5);

  const formatActivityDate = (date: string) => {
    const activityDate = new Date(date);

    if (Number.isNaN(activityDate.getTime())) {
      return t("overview.unknownDate");
    }

    return activityDate.toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const stats = [
    {
      title: t("overview.stats.revenue"),
      value: formatCurrency(48290),
      description: t("overview.stats.demoData"),
      icon: <Wallet size={20} />,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      title: t("overview.stats.clients"),
      value: clients.length.toString(),
      description: t("overview.stats.registeredClients"),
      icon: <Users size={20} />,
      color: "text-blue-400",
      background: "bg-blue-500/10",
    },
    {
      title: t("overview.stats.campaigns"),
      value: campaigns.length.toString(),
      description: t("overview.stats.registeredCampaigns"),
      icon: <Megaphone size={20} />,
      color: "text-purple-400",
      background: "bg-purple-500/10",
    },
    {
      title: t("overview.stats.convertedLeads"),
      value: `${convertedLeads}/${leads.length}`,
      description: t("overview.stats.convertedDescription"),
      icon: <TrendingUp size={20} />,
      color: "text-orange-400",
      background: "bg-orange-500/10",
    },
    {
      title: t("overview.stats.conversionRate"),
      value: `${conversionRate}%`,
      description: t("overview.stats.conversionDescription"),
      icon: <MousePointerClick size={20} />,
      color: "text-cyan-400",
      background: "bg-cyan-500/10",
    },
  ];

  const translatedChartData = chartData.map((item) => ({
    ...item,
    month: t(`overview.months.${item.month}`),
  }));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {t("overview.welcome", { name: "Yazid" })}
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          {t("overview.description")}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#263247] bg-[#111827] p-5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.background} ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              {stat.title}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {stat.value}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Chart and activities */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-[#263247] bg-[#111827] p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              {t("overview.revenue.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t("overview.revenue.description")}
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={translatedChartData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2563EB"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#2563EB"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#263247"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748B"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #263247",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    t("overview.revenue.label"),
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent activities */}
        <div className="rounded-2xl border border-[#263247] bg-[#111827] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t("overview.activities.title")}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {t("overview.activities.description")}
              </p>
            </div>

            <Activity className="text-blue-400" size={20} />
          </div>

          {recentActivities.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <Clock size={28} className="mb-3 text-slate-600" />

              <p className="text-sm text-slate-400">
                {t("overview.activities.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getActivityStyle(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200">
                      {getActivityLabel(activity)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatActivityDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="rounded-2xl border border-[#263247] bg-[#111827] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t("overview.campaigns.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t("overview.campaigns.description")}
            </p>
          </div>

          <Megaphone size={20} className="text-purple-400" />
        </div>

        {recentCampaigns.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {t("overview.campaigns.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="border-b border-[#263247] text-xs text-slate-500">
                  <th className="pb-4 font-medium">
                    {t("overview.table.campaign")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.channel")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.budget")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.status")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-[#263247]/60 last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-white">
                      {campaign.name}
                    </td>

                    <td className="py-4 text-sm text-slate-400">
                      {campaign.channel}
                    </td>

                    <td className="py-4 text-sm text-slate-300">
                      {formatCurrency(Number(campaign.budget))}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        {getCampaignStatusLabel(campaign.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent leads */}
      <div className="rounded-2xl border border-[#263247] bg-[#111827] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t("overview.leads.title")}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t("overview.leads.description")}
            </p>
          </div>

          <UserRound size={20} className="text-emerald-400" />
        </div>

        {recentLeads.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {t("overview.leads.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="border-b border-[#263247] text-xs text-slate-500">
                  <th className="pb-4 font-medium">
                    {t("overview.table.name")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.company")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.source")}
                  </th>
                  <th className="pb-4 font-medium">
                    {t("overview.table.status")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#263247]/60 last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-white">
                      {lead.name}
                    </td>

                    <td className="py-4 text-sm text-slate-400">
                      {lead.company}
                    </td>

                    <td className="py-4 text-sm text-slate-400">
                      {getLeadSourceLabel(lead.source)}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                        {getLeadStatusLabel(lead.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
