import { createContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { tenantApi } from "../api/tenantApi";
import PERMISSIONS from "../constants/permissions";

const AuthContext = createContext(null);

const getInitialUser = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

const getInitialTenant = () => {
  if (typeof window !== "undefined") {
    const storedTenant = localStorage.getItem("tenant");
    return storedTenant ? JSON.parse(storedTenant) : null;
  }
  return null;
};

const getInitialPortals = () => {
  if (typeof window !== "undefined") {
    const storedPortals = localStorage.getItem("portals");
    return storedPortals ? JSON.parse(storedPortals) : [];
  }
  return [];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [tenant, setTenant] = useState(getInitialTenant);
  const [portals, setPortals] = useState(getInitialPortals);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.success) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            if (response.data.tenant) {
              setTenant(response.data.tenant);
              localStorage.setItem("tenant", JSON.stringify(response.data.tenant));
            }
            if (response.data.portals) {
              setPortals(response.data.portals);
              localStorage.setItem("portals", JSON.stringify(response.data.portals));
            }
          }
        } catch (error) {
          console.error("Failed to verify user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("tenant");
          localStorage.removeItem("portals");
          setUser(null);
          setTenant(null);
          setPortals([]);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = (userData, tenantData, associatedPortals, token) => {
    setUser(userData);
    setTenant(tenantData);
    setPortals(associatedPortals || []);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tenant", JSON.stringify(tenantData));
    localStorage.setItem("portals", JSON.stringify(associatedPortals || []));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    setPortals([]);
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    localStorage.removeItem("token");
    localStorage.removeItem("portals");
    authApi.logout();
  };

  const switchPortal = async (tenantId) => {
    try {
      const response = await authApi.switchPortal(tenantId);
      if (response.success) {
        const { user: userData, tenant: tenantData, token } = response.data;
        setUser(userData);
        setTenant(tenantData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("tenant", JSON.stringify(tenantData));
        localStorage.setItem("token", token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to switch portal:", error);
      throw error;
    }
  };

  const setDefaultPortal = async (tenantId) => {
    try {
      const response = await authApi.setDefaultPortal(tenantId);
      if (response.success) {
        setPortals((prev) =>
          prev.map((p) => ({
            ...p,
            isDefaultPortal: p.tenantId === tenantId,
          }))
        );
        const storedPortals = localStorage.getItem("portals");
        if (storedPortals) {
          const parsed = JSON.parse(storedPortals);
          const updated = parsed.map((p) => ({
            ...p,
            isDefaultPortal: p.tenantId === tenantId,
          }));
          localStorage.setItem("portals", JSON.stringify(updated));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to set default portal:", error);
      throw error;
    }
  };

  // Inject portal branding color variables dynamically
  useEffect(() => {
    if (tenant?.branding) {
      const primary = tenant.branding.primaryColor || "#3b82f6";
      const secondary = tenant.branding.secondaryColor || "#8b5cf6";
      document.documentElement.style.setProperty("--primary", primary);
      document.documentElement.style.setProperty("--sidebar-primary", primary);
      document.documentElement.style.setProperty("--accent", primary);
      document.documentElement.style.setProperty("--ring", primary);
      document.documentElement.style.setProperty("--chart-1", primary);
      
      document.documentElement.style.setProperty("--secondary", secondary);
      document.documentElement.style.setProperty("--sidebar-accent", secondary);
      document.documentElement.style.setProperty("--chart-2", secondary);
    } else {
      // Restore default CMS orange theme
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--sidebar-primary");
      document.documentElement.style.removeProperty("--accent");
      document.documentElement.style.removeProperty("--ring");
      document.documentElement.style.removeProperty("--chart-1");
      
      document.documentElement.style.removeProperty("--secondary");
      document.documentElement.style.removeProperty("--sidebar-accent");
      document.documentElement.style.removeProperty("--chart-2");
    }
  }, [tenant]);

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has permission for a specific module
  const hasPermission = (permission) => {
    if (!user) {
      return false;
    }

    // Admin has all permissions
    if (user.role === "admin") {
      return true;
    }

    // Operator has all permissions except user management
    if (user.role === "operator") {
      const result = permission !== PERMISSIONS.USERS;
      return result;
    }

    // Custom role - check customPermissions
    if (user.role === "custom" && user.customPermissions) {
      let key = permission;
      if (permission === PERMISSIONS.ACCOUNTING) {
        key = PERMISSIONS.CHART_OF_ACCOUNTS;
      }
      const result = user.customPermissions[key] === true;
      return result;
    }

    return false;
  };

  const value = {
    user,
    tenant,
    portals,
    login,
    logout,
    switchPortal,
    setDefaultPortal,
    isAuthenticated,
    hasRole,
    hasPermission,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
