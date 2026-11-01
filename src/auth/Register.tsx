
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("growthflow_language", language);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Inscription de démonstration uniquement.
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0B1020] text-white">
      {/* Left presentation panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-slate-800 bg-[#111827] p-12 lg:flex">
        <div className="absolute -right-32 top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <TrendingUp size={24} />
          </div>
          <span className="text-2xl font-bold">GrowthFlow</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-400">
            {t("auth.register.badge")}
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            {t("auth.register.heroTitle")}{" "}
            <span className="text-blue-500">
              {t("auth.register.heroHighlight")}
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            {t("auth.register.heroDescription")}
          </p>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          {t("auth.copyright")}
        </p>
      </div>

      {/* Registration form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-end">
            <select
              value={i18n.language.split("-")[0]}
              onChange={(e) => handleLanguageChange(e.target.value)}
              aria-label={t("header.language")}
              className="rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <TrendingUp size={22} />
            </div>
            <span className="text-xl font-bold">GrowthFlow</span>
          </div>

          <h2 className="text-3xl font-bold">
            {t("auth.register.title")}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {t("auth.register.description")}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t("auth.fullName")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <UserRound size={19} className="text-slate-500" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.fullNamePlaceholder")}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t("auth.agencyName")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <Building2 size={19} className="text-slate-500" />
                <input
                  required
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder={t("auth.agencyPlaceholder")}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t("auth.professionalEmail")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <Mail size={19} className="text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t("auth.password")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <Lock size={19} className="text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={t("auth.togglePassword")}
                  className="text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 text-xs leading-5 text-slate-400">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-blue-500"
              />
              {t("auth.register.terms")}
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold hover:bg-blue-500"
            >
              {t("auth.register.submit")}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            {t("auth.register.haveAccount")}{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {t("auth.login.submit")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
