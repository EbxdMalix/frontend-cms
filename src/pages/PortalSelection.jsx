import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiLayout, FiUser, FiArrowRight, FiLogOut, FiStar } from "react-icons/fi";

const PortalSelection = () => {
  const { user, portals, switchPortal, setDefaultPortal, logout } = useContext(AuthContext);
  const [loadingPortal, setLoadingPortal] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSelectPortal = async (tenantId) => {
    setLoadingPortal(tenantId);
    setError("");
    try {
      const success = await switchPortal(tenantId);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Failed to switch to the selected portal.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while switching portals.");
    } finally {
      setLoadingPortal(null);
    }
  };

  const handleToggleDefault = async (e, tenantId) => {
    e.stopPropagation();
    setError("");
    try {
      const success = await setDefaultPortal(tenantId);
      if (!success) {
        setError("Failed to configure default workspace.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while pinning default workspace.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Sort: default first, then by lastAccessedAt DESC, then alphabetically
  const sortedPortals = [...portals].sort((a, b) => {
    if (a.isDefaultPortal && !b.isDefaultPortal) return -1;
    if (!a.isDefaultPortal && b.isDefaultPortal) return 1;

    const timeA = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
    const timeB = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;

    return a.portalName.localeCompare(b.portalName);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FiLayout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Construction CMS
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center my-12 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Please select the company workspace you would like to manage.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-lg mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {sortedPortals.map((portal) => (
            <div
              key={portal.tenantId}
              onClick={() => !loadingPortal && handleSelectPortal(portal.tenantId)}
              className={`group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px] overflow-hidden ${
                loadingPortal === portal.tenantId ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {/* Card Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Workspace Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-white text-lg group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">
                    {getInitials(portal.portalName)}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Default Pin Star */}
                    <button
                      onClick={(e) => handleToggleDefault(e, portal.tenantId)}
                      className={`p-1.5 rounded-lg border transition duration-200 ${
                        portal.isDefaultPortal
                          ? "bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:text-amber-400 hover:bg-slate-800"
                      }`}
                      title={portal.isDefaultPortal ? "Default Workspace (Pinned)" : "Pin as Default Workspace"}
                    >
                      <FiStar className="w-3.5 h-3.5" />
                    </button>

                    {/* Scoped Role Badge */}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize border ${
                      portal.role === "admin"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : portal.role === "operator"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {portal.role}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {portal.portalName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
                    ID: {portal.tenantId}
                  </p>
                  {portal.isDefaultPortal && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Pinned Default
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                  {loadingPortal === portal.tenantId ? "Entering workspace..." : "Enter Workspace"}
                </span>
                <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-600 py-4 z-10">
        &copy; {new Date().getFullYear()} Construction Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default PortalSelection;
