"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { FiUser, FiKey, FiMail, FiShield, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function UserProfile() {
  const { user, portals, setUser } = useContext(AuthContext);

  // Profile info state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setProfileLoading(true);

    try {
      const response = await authApi.updateProfile(name, email);
      if (response.success) {
        setProfileSuccess(response.message || "Profile updated successfully!");
        // Update user state in AuthContext
        setUser({
          ...user,
          name: response.data.name,
          email: response.data.email,
        });
      }
    } catch (err) {
      console.error(err);
      setProfileError(err.message || "Failed to update profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await authApi.changePassword(currentPassword, newPassword);
      if (response.success) {
        setPasswordSuccess(response.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || "Failed to change password. Please verify your current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FiUser className="text-primary w-6 h-6" />
          <span>My Profile Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information, credentials, and access settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <FiUser className="text-primary w-4.5 h-4.5" />
              <span>Personal Details</span>
            </h2>

            {profileSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
                <FiCheckCircle className="shrink-0 w-4 h-4" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
                <FiAlertCircle className="shrink-0 w-4 h-4" />
                <span>{profileError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={profileLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={profileLoading}
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                System Role
              </label>
              <div className="relative">
                <FiShield className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={user?.role || "user"}
                  disabled
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background/50 text-muted-foreground text-sm capitalize select-none cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {profileLoading ? "Updating Details..." : "Save Profile Details"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <FiKey className="text-primary w-4.5 h-4.5" />
              <span>Change Password</span>
            </h2>

            {passwordSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
                <FiCheckCircle className="shrink-0 w-4 h-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
                <FiAlertCircle className="shrink-0 w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={passwordLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={passwordLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={passwordLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {passwordLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Portal Workspaces Access Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-2 flex items-center gap-2 mb-4">
          <FiShield className="text-primary w-4.5 h-4.5" />
          <span>Your Assigned Portal Workspaces</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portals && portals.map((p) => (
            <div key={p.tenantId} className="flex flex-col justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/40 transition-colors">
              <div>
                <h3 className="font-bold text-sm text-foreground truncate">{p.portalName}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">ID: {p.tenantId}</p>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/60">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">Access role:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold capitalize">{p.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
