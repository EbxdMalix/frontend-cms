import api from "./config";
// Auth API functions
export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      if (error.code === "ECONNABORTED") {
        throw { message: "Request timeout - server not responding" };
      }
      if (error.code === "ERR_NETWORK") {
        throw { message: "Network error - cannot reach server" };
      }
      throw (
        error.response?.data || { message: error.message || "Login failed" }
      );
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user" };
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
  },

  // Switch portal
  switchPortal: async (tenantId) => {
    try {
      const response = await api.post("/auth/switch-portal", { tenantId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to switch portal" };
    }
  },

  // Set default portal
  setDefaultPortal: async (tenantId) => {
    try {
      const response = await api.post("/auth/set-default", { tenantId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to set default portal" };
    }
  },

  // Update profile
  updateProfile: async (name, email) => {
    try {
      const response = await api.put("/auth/update-profile", { name, email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/auth/change-password", { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to change password" };
    }
  },
};

export default api;
