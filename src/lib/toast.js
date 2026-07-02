import { toast } from "sonner";

/**
 * Convenience wrappers around sonner toast for consistent app-wide usage.
 * Sonner is already installed as a dependency.
 */

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};

/**
 * Show a confirmation toast with a custom message and optional action.
 * Returns a promise that resolves to the user's choice.
 */
export const confirmToast = (message, options = {}) => {
  return new Promise((resolve) => {
    toast(message, {
      ...options,
      action: {
        label: options.actionLabel || "Confirm",
        onClick: () => resolve(true),
      },
      cancel: {
        label: "Cancel",
        onClick: () => resolve(false),
      },
      duration: options.duration || 5000,
    });
  });
};

// Re-export full sonner API for advanced usage
export { toast };