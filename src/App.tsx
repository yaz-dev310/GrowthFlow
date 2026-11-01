
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

// Lazy loading des pages
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));

const Overview = lazy(() => import("./pages/Overview"));
const Clients = lazy(() => import("./pages/Clients"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Leads = lazy(() => import("./pages/Leads"));
const Settings = lazy(() => import("./pages/Settings"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1020]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#263247] border-t-[#2563EB]" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="clients" element={<Clients />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leads" element={<Leads />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
