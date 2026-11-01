
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logActivity } from "../utils/activityLogger";
import {
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

type Client = {
  id: number;
  name: string;
  sector: string;
  campaigns: number;
  status: string;
};

type OutletContext = {
  searchQuery: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    name: "Nova Digital",
    sector: "Technologie",
    campaigns: 4,
    status: "Actif",
  },
  {
    id: 2,
    name: "Maison Élégance",
    sector: "E-commerce",
    campaigns: 3,
    status: "Actif",
  },
  {
    id: 3,
    name: "Green Horizon",
    sector: "Environnement",
    campaigns: 2,
    status: "En attente",
  },
  {
    id: 4,
    name: "Urban Studio",
    sector: "Immobilier",
    campaigns: 5,
    status: "Actif",
  },
];

export default function Clients() {
  const { t } = useTranslation();
  const { searchQuery } = useOutletContext<OutletContext>();

  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem("growthflow_clients");

    if (savedClients) {
      try {
        return JSON.parse(savedClients) as Client[];
      } catch {
        return initialClients;
      }
    }

    return initialClients;
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("Actif");

  useEffect(() => {
    localStorage.setItem(
      "growthflow_clients",
      JSON.stringify(clients)
    );

    window.dispatchEvent(new Event("growthflow:data-updated"));
  }, [clients]);

  const filteredClients = clients.filter((client) => {
    const query = `${searchQuery} ${search}`.trim().toLowerCase();

    return `${client.name} ${client.sector} ${client.status}`
      .toLowerCase()
      .includes(query);
  });

  function resetForm() {
    setName("");
    setSector("");
    setStatus("Actif");
    setEditingClient(null);
    setShowForm(false);
  }

  function handleAddClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingClient !== null) {
      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === editingClient
            ? {
                ...client,
                name: name.trim(),
                sector: sector.trim(),
                status,
              }
            : client
        )
      );

      logActivity(
        "client",
        "updated",
        `Client ${name.trim()} modifié`
      );
    } else {
      const newClient: Client = {
        id: Date.now(),
        name: name.trim(),
        sector: sector.trim(),
        campaigns: 0,
        status,
      };

      setClients((currentClients) => [
        ...currentClients,
        newClient,
      ]);

      logActivity(
        "client",
        "created",
        `Nouveau client ajouté : ${name.trim()}`
      );
    }

    resetForm();
  }

  function handleEditClient(client: Client) {
    setName(client.name);
    setSector(client.sector);
    setStatus(client.status);
    setEditingClient(client.id);
    setShowForm(true);
  }

  function handleDeleteClient(client: Client) {
    const confirmed = window.confirm(
      t("clients.confirmDelete", { name: client.name })
    );

    if (confirmed) {
      setClients((currentClients) =>
        currentClients.filter((item) => item.id !== client.id)
      );

      logActivity(
        "client",
        "deleted",
        `Client ${client.name} supprimé`
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {t("clients.heading")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {t("clients.description")}
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          {t("clients.add")}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingClient !== null
                ? t("clients.editTitle")
                : t("clients.newTitle")}
            </h3>

            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-white"
              type="button"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleAddClient}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("clients.companyName")}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none"
            />

            <input
              required
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder={t("clients.sector")}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-700 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="Actif">{t("clients.active")}</option>
              <option value="En attente">{t("clients.pending")}</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
            >
              {editingClient !== null
                ? t("clients.saveChanges")
                : t("clients.addClient")}
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-4 py-3">
        <Search size={18} className="text-slate-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("clients.search")}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="p-4">{t("clients.client")}</th>
              <th className="p-4">{t("clients.sectorLabel")}</th>
              <th className="p-4">{t("clients.campaigns")}</th>
              <th className="p-4">{t("clients.status")}</th>
              <th className="p-4 text-right">{t("common.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-slate-800/70 text-slate-300 last:border-0"
              >
                <td className="p-4 font-medium text-white">
                  {client.name}
                </td>

                <td className="p-4">{client.sector}</td>
                <td className="p-4">{client.campaigns}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      client.status === "Actif"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {client.status === "Actif"
                      ? t("clients.active")
                      : t("clients.pending")}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClient(client)}
                      title={t("common.edit")}
                      aria-label={t("common.edit")}
                      className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteClient(client)}
                      title={t("common.delete")}
                      aria-label={t("common.delete")}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  {t("clients.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
