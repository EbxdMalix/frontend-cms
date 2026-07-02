"use client";

import { useState, lazy, Suspense } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Loader from "./sections/Loader";

const Sidebar = lazy(() => import("./../layout/Sidebar"));
const Header = lazy(() => import("./../layout/Header"));

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tenant, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAutoAlert, setShowAutoAlert] = useState(() => {
    return sessionStorage.getItem("autoRoutedAlert") === "true";
  });

  // Extract current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname
      .replace("/dashboard/", "")
      .replace("/dashboard", "dashboard");
    return path || "dashboard";
  };

  const handleNavigate = (page) => {
    // Navigate to the route
    if (page === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${page}`);
    }
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen w-full">
            <Loader />
          </div>
        }
      >
        <Sidebar
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={user}
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          {showAutoAlert && tenant && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 px-6 py-2.5 flex items-center justify-between text-xs font-medium shrink-0 animate-fade-in z-20">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>Auto-entered default workspace: <strong>{tenant.portalName}</strong>. You can change workspaces at any time in the sidebar switcher.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("autoRoutedAlert");
                    setShowAutoAlert(false);
                    navigate("/portal-selection");
                  }}
                  className="underline hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Choose Workspace
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("autoRoutedAlert");
                    setShowAutoAlert(false);
                  }}
                  className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 hover:bg-amber-500/30 font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </Suspense>
    </div>
  );
}
