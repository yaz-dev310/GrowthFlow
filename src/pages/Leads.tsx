
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserRound,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { logActivity } from "../utils/activityLogger";

type Lead = {
  id: number;
  name: string;
  company: string;
  source: string;
  status: string;
};

type OutletContext = {
  searchQuery: string;
};

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Alexandre Martin",
    company: "Nova Digital",
    source: "Site web",
    status: "Nouveau",
  },
  {
    id: 2,
    name: "Sophie Laurent",
    company: "Maison Élégance",
    source: "LinkedIn",
    status: "Contacté",
  },
  {
    id: 3,
    name: "Thomas Bernard",
    company: "Urban Studio",
    source: "Publicité",
    status: "Qualifié",
  },
];

const statuses = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Converti",
  "Perdu",
];

const sources = [
  "Site web",
  "LinkedIn",
  "Publicité",
  "Recommandation",
  "Autre",
];

export default function Leads() {
  const { t } = useTranslation();
  const { searchQuery } = useOutletContext<OutletContext>();

  const [leads, setLeads] = useState<Lead[]>(() => {
    const savedLeads = localStorage.getItem("growthflow_leads");

    if (savedLeads) {
      try {
        return JSON.parse(savedLeads) as Lead[];
      } catch {
        return initialLeads;
      }
    }

    return initialLeads;
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    source: "Site web",
    status: "Nouveau",
  });

  useEffect(() => {
    localStorage.setItem("growthflow_leads", JSON.stringify(leads));
    window.dispatchEvent(new Event("growthflow:data-updated"));
  }, [leads]);

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      source: "Site web",
      status: "Nouveau",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const leadName = form.name.trim();

    const leadData = {
      ...form,
      name: leadName,
      company: form.company.trim(),
    };

    if (editingId !== null) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingId
            ? { ...lead, ...leadData }
            : lead
        )
      );

      logActivity("lead", "updated", `Lead ${leadName} modifié`);
    } else {
      setLeads((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...leadData,
        },
      ]);

      logActivity("lead", "created", `Nouveau lead ajouté : ${leadName}`);
    }

    resetForm();
  };

  const handleEdit = (lead: Lead) => {
    setForm({
      name: lead.name,
      company: lead.company,
      source: lead.source,
      status: lead.status,
    });

    setEditingId(lead.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const lead = leads.find((item) => item.id === id);

    if (lead && window.confirm(t("leads.confirmDelete"))) {
      setLeads((prev) => prev.filter((item) => item.id !== id));

      logActivity("lead", "deleted", `Lead ${lead.name} supprimé`);
    }
  };

  const handleStatusChange = (lead: Lead, newStatus: string) => {
    if (newStatus === lead.status) return;

    setLeads((prev) =>
      prev.map((item) =>
        item.id === lead.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    logActivity(
      "lead",
      "updated",
      `Statut du lead ${lead.name} modifié : ${lead.status} → ${newStatus}`
    );
  };

  const query = `${searchQuery} ${search}`.trim().toLowerCase();

  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.company} ${lead.source} ${lead.status}`
      .toLowerCase()
      .includes(query)
  );

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      Nouveau: "bg-blue-500/10 text-blue-400",
      Contacté: "bg-yellow-500/10 text-yellow-400",
      Qualifié: "bg-purple-500/10 text-purple-400",
      Converti: "bg-green-500/10 text-green-400",
      Perdu: "bg-red-500/10 text-red-400",
    };

    return styles[status] || "bg-slate-500/10 text-slate-400";
  };

  const getStatusLabel = (status: string) =>
    t(`leads.statuses.${statuses.indexOf(status)}`);

  const getSourceLabel = (source: string) =>
    t(`leads.sources.${sources.indexOf(source)}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {t("leads.heading")}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {t("leads.description")}
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-500"
        >
          <Plus size={18} />
          {t("leads.add")}
        </button>
      </div>

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("leads.search")}
          className="w-full rounded-xl border border-slate-800 bg-[#111827] py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-[#111827] p-5"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              {editingId !== null
                ? t("leads.editTitle")
                : t("leads.newTitle")}
            </h4>

            <button
              type="button"
              onClick={resetForm}
              aria-label={t("common.close")}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder={t("leads.name")}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="rounded-xl border border-slate-700 bg-[#0B1020] p-3 text-sm outline-none focus:border-blue-500"
            />

            <input
              required
              placeholder={t("leads.company")}
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
              className="rounded-xl border border-slate-700 bg-[#0B1020] p-3 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
              className="rounded-xl border border-slate-700 bg-[#0B1020] p-3 text-sm outline-none"
              aria-label={t("leads.source")}
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {getSourceLabel(source)}
                </option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="rounded-xl border border-slate-700 bg-[#0B1020] p-3 text-sm outline-none"
              aria-label={t("leads.status")}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium hover:bg-blue-500"
            >
              {editingId !== null
                ? t("leads.saveChanges")
                : t("leads.addLead")}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <UserRound size={20} />
              </div>

              <div>
                <p className="font-medium">{lead.name}</p>

                <p className="text-sm text-slate-400">
                  {lead.company} · {getSourceLabel(lead.source)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={lead.status}
                onChange={(e) =>
                  handleStatusChange(lead, e.target.value)
                }
                className={`rounded-full border-0 px-3 py-2 text-xs outline-none ${getStatusStyle(lead.status)}`}
                aria-label={t("leads.status")}
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-[#111827] text-white"
                  >
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleEdit(lead)}
                className="text-slate-400 hover:text-blue-400"
                title={t("common.edit")}
                aria-label={t("common.edit")}
              >
                <Pencil size={17} />
              </button>

              <button
                onClick={() => handleDelete(lead.id)}
                className="text-slate-400 hover:text-red-400"
                title={t("common.delete")}
                aria-label={t("common.delete")}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <p className="rounded-xl border border-slate-800 p-6 text-center text-sm text-slate-400">
            {t("leads.empty")}
          </p>
        )}
      </div>
    </div>
  );
}
