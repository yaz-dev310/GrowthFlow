
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("growthflow_language", language);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Authentification de démonstration uniquement.
    navigate("/");
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
            {t("auth.login.badge")}
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            {t("auth.login.heroTitle")}{" "}
            <span className="text-blue-500">GrowthFlow.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            {t("auth.login.heroDescription")}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
              <p className="text-2xl font-bold">+24.8%</p>
              <p className="mt-1 text-sm text-slate-400">
                {t("auth.login.growth")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
              <p className="text-2xl font-bold">+120</p>
              <p className="mt-1 text-sm text-slate-400">
                {t("auth.login.agencies")}
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          {t("auth.copyright")}
        </p>
      </div>

      {/* Login form */}
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

          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <TrendingUp size={22} />
            </div>
            <span className="text-xl font-bold">GrowthFlow</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {t("auth.login.title")}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {t("auth.login.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t("auth.email")}
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <Mail size={19} className="text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  {t("auth.password")}
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  {t("auth.login.forgotPassword")}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 focus-within:border-blue-500">
                <Lock size={19} className="text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white"
                  aria-label={t("auth.togglePassword")}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-400">
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-500"
              />
              {t("auth.login.rememberMe")}
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {t("auth.login.submit")}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {t("auth.login.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
