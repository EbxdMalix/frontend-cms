"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../context/useAuth";
import { authApi } from "../api/authApi";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { showToast } from "../lib/toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoOpenDefault, setAutoOpenDefault] = useState(() => {
    return localStorage.getItem("autoOpenDefault") !== "false";
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        // Store user, tenant, portals, and token
        login(
          response.data.user,
          response.data.tenant,
          response.data.portals,
          response.data.token
        );
        
        // Sync local storage preference
        localStorage.setItem("autoOpenDefault", autoOpenDefault ? "true" : "false");

        if (
          response.data.portals &&
          response.data.portals.length > 1 &&
          (!response.data.isAutoRouted || !autoOpenDefault)
        ) {
          navigate("/portal-selection");
        } else {
          if (response.data.isAutoRouted && response.data.portals && response.data.portals.length > 1) {
            sessionStorage.setItem("autoRoutedAlert", "true");
          }
          navigate("/dashboard");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <div className="w-full h-full bg-card grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:block h-full">
          <img
            src="/loginpage.jpeg"
            alt="Construction CMS"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 overflow-y-auto flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
              <FiLock className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Construction CMS
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Multi-Portal Management System
            </p>
          </div>
          {/* ---------------- LOGIN FORM ---------------- */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4"
                  placeholder="•••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="autoOpenDefault"
                checked={autoOpenDefault}
                onCheckedChange={(checked) => setAutoOpenDefault(!!checked)}
              />
              <label htmlFor="autoOpenDefault" className="text-xs text-muted-foreground cursor-pointer select-none">
                Auto-open default workspace on login
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
