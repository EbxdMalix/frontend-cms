"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { tenantApi } from "../../api/tenantApi";
import { FiSettings, FiGlobe, FiPhone, FiMapPin, FiCheckCircle, FiAlertCircle, FiPenTool } from "react-icons/fi";
import Loader from "./Loader";

export default function PortalSettings() {
  const { tenant, setTenant } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [portalName, setPortalName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  
  // Branding Colors
  const [primaryColor, setPrimaryColor] = useState("#c5630c");
  const [secondaryColor, setSecondaryColor] = useState("#a47f6f");

  useEffect(() => {
    fetchTenantInfo();
  }, []);

  const fetchTenantInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await tenantApi.getCurrentTenant();
      if (response.success && response.data) {
        const t = response.data;
        setPortalName(t.portalName || "");
        setAdminName(t.adminName || "");
        setPhoneNumber(t.phoneNumber || "");
        setAddress(t.address || "");
        setCity(t.city || "");
        setCountry(t.country || "");
        setPrimaryColor(t.branding?.primaryColor || "#c5630c");
        setSecondaryColor(t.branding?.secondaryColor || "#a47f6f");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load portal configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSubmitting(true);

    const payload = {
      portalName,
      adminName,
      phoneNumber,
      address,
      city,
      country,
      branding: {
        primaryColor,
        secondaryColor,
      },
    };

    try {
      const response = await tenantApi.updateCurrentTenant(payload);
      if (response.success && response.data) {
        setSuccess(response.message || "Portal configuration updated successfully!");
        // Update context
        setTenant(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save portal settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FiSettings className="text-primary w-6 h-6" />
          <span>Portal Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage system identity, contact information, and branding for the active portal workspace.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <FiCheckCircle className="shrink-0 w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <FiAlertCircle className="shrink-0 w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portal Information Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <FiGlobe className="text-primary w-4.5 h-4.5" />
            <span>Workspace Profile & Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Portal Name
              </label>
              <input
                type="text"
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Workspace/Company Name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Administrator Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Lead Admin Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={submitting}
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+1 555-0199"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Portal Identifier (Locked)
              </label>
              <input
                type="text"
                value={tenant?.tenantId || ""}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-background/50 text-muted-foreground text-sm cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-1 mt-6">
              Location details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={submitting}
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="123 Builder Lane"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Metropolis"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Portal Branding Options Card */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex-1">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <FiPenTool className="text-primary w-4.5 h-4.5" />
              <span>Portal Branding</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    disabled={submitting}
                    className="w-10 h-10 border border-border rounded-lg bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    disabled={submitting}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    disabled={submitting}
                    className="w-10 h-10 border border-border rounded-lg bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    disabled={submitting}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Branding Preview Box */}
              <div className="border border-border/85 rounded-lg p-3 bg-background mt-4 space-y-2 select-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Accent Palette Preview
                </span>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: primaryColor }} />
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: secondaryColor }} />
                </div>
                <div className="text-[10px] text-muted-foreground text-center pt-1">
                  Colors will apply to UI buttons, indicators, and charts.
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving Configuration..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
