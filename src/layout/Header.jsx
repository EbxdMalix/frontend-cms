"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiUser, FiChevronDown, FiSettings, FiShield } from "react-icons/fi";
import NotificationBell from "../components/NotificationBell";

export default function Header({ user, onLogout, onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-muted rounded-lg transition text-foreground sm:hidden"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-end w-full gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Premium Profile Widget */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-muted/80 border border-transparent hover:border-border transition-all duration-200 cursor-pointer text-left focus:outline-none"
          >
            {/* Avatar with dynamic gradient */}
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm text-sm border-2 border-card select-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            <div className="hidden sm:block min-w-0 max-w-[120px]">
              <p className="text-xs font-semibold text-foreground truncate leading-tight select-none">
                {user?.name}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize leading-tight mt-0.5 font-medium flex items-center gap-1 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {user?.role}
              </p>
            </div>
            
            <FiChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Click-away backdrop */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setIsProfileOpen(false)} 
              />
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Info Header */}
                <div className="px-3.5 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {user?.email || "No email available"}
                  </p>
                </div>

                {/* Role Badge Section */}
                <div className="px-3.5 py-1.5 border-b border-border bg-muted/10">
                  <div className="flex items-center gap-2 text-[9px] text-foreground font-semibold uppercase tracking-wider">
                    <FiShield className="w-3.5 h-3.5 text-primary" />
                    <span>Access Level: {user?.role}</span>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/dashboard/profile");
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors cursor-pointer"
                  >
                    <FiUser className="w-4 h-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>
                  
                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/dashboard/portal-settings");
                      }}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors cursor-pointer"
                    >
                      <FiSettings className="w-4 h-4 text-muted-foreground" />
                      <span>Portal Settings</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-red-500 hover:bg-red-500/10 text-left transition-colors cursor-pointer font-semibold"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
