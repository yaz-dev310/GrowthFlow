
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ChartNoAxesCombined,
  TrendingUp,
  MousePointerClick,
  Users,
  Target,
  CalendarDays,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "7j" | "30j" | "90j" | "12m";

const periodData = {
  "7j": {
    metrics: [
      { label: "visitors", value: "2 840", change: "+8,2%", icon: TrendingUp },
      { label: "conversions", value: "214", change: "+5,4%", icon: ChartNoAxesCombined },
      { label: "clickRate", value: "4,2%", change: "+1,1%", icon: MousePointerClick },
      { label: "leads", value: "86", change: "+12,5%", icon: Users },
      { label: "conversionRate", value: "7,5%", change: "+2,3%", icon: Target },
    ],
    visitors: [
      { month: "Mon", visiteurs: 320 },
      { month: "Tue", visiteurs: 410 },
      { month: "Wed", visiteurs: 380 },
      { month: "Thu", visiteurs: 520 },
      { month: "Fri", visiteurs: 480 },
      { month: "Sat", visiteurs: 610 },
      { month: "Sun", visiteurs: 570 },
    ],
    campaigns: [
      { name: "Google Ads", conversions: 42 },
      { name: "Facebook", conversions: 31 },
      { name: "LinkedIn", conversions: 24 },
      { name: "Instagram", conversions: 38 },
    ],
  },
  "30j": {
    metrics: [
      { label: "visitors", value: "12 450", change: "+10,4%", icon: TrendingUp },
      { label: "conversions", value: "986", change: "+7,8%", icon: ChartNoAxesCombined },
      { label: "clickRate", value: "4,5%", change: "+1,8%", icon: MousePointerClick },
      { label: "leads", value: "342", change: "+13,2%", icon: Users },
      { label: "conversionRate", value: "7,9%", change: "+2,6%", icon: Target },
    ],
    visitors: [
      { month: "W1", visiteurs: 2800 },
      { month: "W2", visiteurs: 3100 },
      { month: "W3", visiteurs: 2950 },
      { month: "W4", visiteurs: 3600 },
    ],
    campaigns: [
      { name: "Google Ads", conversions: 240 },
      { name: "Facebook", conversions: 180 },
      { name: "LinkedIn", conversions: 150 },
      { name: "Instagram", conversions: 210 },
    ],
  },
  "90j": {
    metrics: [
      { label: "visitors", value: "32 680", change: "+11,6%", icon: TrendingUp },
      { label: "conversions", value: "2 450", change: "+9,1%", icon: ChartNoAxesCombined },
      { label: "clickRate", value: "4,7%", change: "+2,0%", icon: MousePointerClick },
      { label: "leads", value: "875", change: "+14,8%", icon: Users },
      { label: "conversionRate", value: "7,8%", change: "+3,1%", icon: Target },
    ],
    visitors: [
      { month: "Month 1", visiteurs: 9200 },
      { month: "Month 2", visiteurs: 10800 },
      { month: "Month 3", visiteurs: 12680 },
    ],
    campaigns: [
      { name: "Google Ads", conversions: 620 },
      { name: "Facebook", conversions: 480 },
      { name: "LinkedIn", conversions: 390 },
      { name: "Instagram", conversions: 560 },
    ],
  },
  "12m": {
    metrics: [
      { label: "visitors", value: "48 290", change: "+12,8%", icon: TrendingUp },
      { label: "conversions", value: "3 842", change: "+8,4%", icon: ChartNoAxesCombined },
      { label: "clickRate", value: "4,86%", change: "+2,1%", icon: MousePointerClick },
      { label: "leads", value: "1 248", change: "+15,2%", icon: Users },
      { label: "conversionRate", value: "7,95%", change: "+3,6%", icon: Target },
    ],
    visitors: [
      { month: "Jan", visiteurs: 3200 },
      { month: "Feb", visiteurs: 4100 },
      { month: "Mar", visiteurs: 3800 },
      { month: "Apr", visiteurs: 5200 },
      { month: "May", visiteurs: 4800 },
      { month: "Jun", visiteurs: 6100 },
      { month: "Jul", visiteurs: 5700 },
      { month: "Aug", visiteurs: 7200 },
      { month: "Sep", visiteurs: 6800 },
      { month: "Oct", visiteurs: 8500 },
      { month: "Nov", visiteurs: 7900 },
      { month: "Dec", visiteurs: 9200 },
    ],
    campaigns: [
      { name: "Google Ads", conversions: 850 },
      { name: "Facebook", conversions: 620 },
      { name: "LinkedIn", conversions: 430 },
      { name: "Instagram", conversions: 710 },
    ],
  },
};

export default function Analytics() {
  const [period, setPeriod] = useState<Period>("12m");
  const { t } = useTranslation();

  const currentData = periodData[period];

  const periodOptions: { label: string; value: Period }[] = [
    { label: t("analytics.periods.7days"), value: "7j" },
    { label: t("analytics.periods.30days"), value: "30j" },
    { label: t("analytics.periods.90days"), value: "90j" },
    { label: t("analytics.periods.12months"), value: "12m" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {t("analytics.heading")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {t("analytics.description")}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#111827] px-3 py-2">
          <CalendarDays size={18} className="text-blue-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="bg-transparent text-sm text-white outline-none"
            aria-label={t("analytics.selectPeriod")}
          >
            {periodOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#111827]"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {currentData.metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
            >
              <Icon size={22} className="mb-4 text-blue-400" />
              <p className="text-sm text-slate-400">
                {t(`analytics.metrics.${metric.label}`)}
              </p>
              <p className="mt-2 text-2xl font-bold">{metric.value}</p>
              <p className="mt-2 text-sm text-emerald-400">
                {metric.change} {t("analytics.previousPeriod")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Evolution des visiteurs */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
        <div className="mb-6">
          <h4 className="font-semibold">
            {t("analytics.visitorsEvolution")}
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            {t("analytics.visitorsDescription")}
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData.visitors}>
              <defs>
                <linearGradient id="visitorColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#263247" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #263247",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Area
                type="monotone"
                dataKey="visiteurs"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#visitorColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance des campagnes */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
        <div className="mb-6">
          <h4 className="font-semibold">
            {t("analytics.campaignPerformance")}
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            {t("analytics.campaignDescription")}
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData.campaigns}>
              <CartesianGrid stroke="#263247" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #263247",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="conversions"
                fill="#8B5CF6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
