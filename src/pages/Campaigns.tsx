
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logActivity } from "../utils/activityLogger";
import {
  Megaphone,
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

type Campaign = {
  id: number;
  name: string;
  channel: string;
  budget: string;
  status: string;
};

type OutletContext = {
  searchQuery: string;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Summer Launch",
    channel: "Instagram Ads",
    budget: "2 500 €",
    status: "En cours",
  },
  {
    id: 2,
    name: "Brand Awareness",
    channel: "Google Ads",
    budget: "1 800 €",
    status: "En cours",
  },
  {
    id: 3,
    name: "Black Friday",
    channel: "Facebook Ads",
    budget: "3 200 €",
    status: "Planifiée",
  },
];

export default function Campaigns() {
  const { t } = useTranslation();
  const { searchQuery } = useOutletContext<OutletContext>();

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const savedCampaigns = localStorage.getItem("growthflow_campaigns");

    if (savedCampaigns) {
      try {
        return JSON.parse(savedCampaigns) as Campaign[];
      } catch {
        return initialCampaigns;
      }
    }

    return initialCampaigns;
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [channel, setChannel] = useState("Instagram Ads");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Planifiée");

  useEffect(() => {
    localStorage.setItem(
      "growthflow_campaigns",
      JSON.stringify(campaigns)
    );

    window.dispatchEvent(new Event("growthflow:data-updated"));
  }, [campaigns]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const query = `${searchQuery} ${search}`.trim().toLowerCase();

    return `${campaign.name} ${campaign.channel} ${campaign.status} ${campaign.budget}`
      .toLowerCase()
      .includes(query);
  });

  function resetForm() {
    setName("");
    setChannel("Instagram Ads");
    setBudget("");
    setStatus("Planifiée");
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const campaign = {
      name: name.trim(),
      channel,
      budget: `${Number(budget).toLocaleString("fr-FR")} €`,
      status,
    };

    if (editingId !== null) {
      setCampaigns((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...campaign } : item
        )
      );

      logActivity(
        "campaign",
        "updated",
        `Campagne ${name.trim()} modifiée`
      );
    } else {
      setCampaigns((current) => [
        ...current,
        { id: Date.now(), ...campaign },
      ]);

      logActivity(
        "campaign",
        "created",
        `Nouvelle campagne ajoutée : ${name.trim()}`
      );
    }

    resetForm();
  }

  function handleEdit(campaign: Campaign) {
    setName(campaign.name);
    setChannel(campaign.channel);
    setBudget(campaign.budget.replace(/\D/g, ""));
    setStatus(campaign.status);
    setEditingId(campaign.id);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    const campaign = campaigns.find((item) => item.id === id);

    if (
      campaign &&
      window.confirm(t("campaigns.confirmDelete"))
    ) {
      setCampaigns((current) =>
        current.filter((item) => item.id !== id)
      );

      logActivity(
        "campaign",
        "deleted",
        `Campagne ${campaign.name} supprimée`
      );
    }
  }

  function getStatusLabel(value: string) {
    const statusLabels: Record<string, string> = {
      "Planifiée": t("campaigns.planned"),
      "En cours": t("campaigns.inProgress"),
      "Terminée": t("campaigns.completed"),
    };

    return statusLabels[value] || value;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {t("campaigns.heading")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {t("campaigns.description")}
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          {t("campaigns.add")}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("campaigns.search")}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingId !== null
                ? t("campaigns.editTitle")
                : t("campaigns.newTitle")}
            </h3>

            <button
              onClick={resetForm}
              type="button"
              aria-label={t("common.close")}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("campaigns.name")}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white"
            />

            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white"
            >
              <option>Instagram Ads</option>
              <option>Facebook Ads</option>
              <option>Google Ads</option>
              <option>LinkedIn Ads</option>
              <option>TikTok Ads</option>
            </select>

            <input
              required
              type="number"
              min="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t("campaigns.budget")}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white"
            >
              <option value="Planifiée">{t("campaigns.planned")}</option>
              <option value="En cours">{t("campaigns.inProgress")}</option>
              <option value="Terminée">{t("campaigns.completed")}</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500 sm:col-span-2"
            >
              {editingId !== null
                ? t("campaigns.saveChanges")
                : t("campaigns.addCampaign")}
            </button>
          </form>
        </div>
      )}

      {/* Campaign results */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Megaphone size={20} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(campaign)}
                    title={t("common.edit")}
                    aria-label={t("common.edit")}
                    className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(campaign.id)}
                    title={t("common.delete")}
                    aria-label={t("common.delete")}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h4 className="font-semibold text-white">
                {campaign.name}
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                {campaign.channel}
              </p>

              <p className="mt-5 text-lg font-bold text-white">
                {campaign.budget}
              </p>

              <span className="mt-3 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                {getStatusLabel(campaign.status)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-10 text-center">
          <Megaphone size={32} className="mx-auto text-slate-500" />
          <p className="mt-3 font-medium text-white">
            {t("campaigns.empty")}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {t("campaigns.emptyDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
