import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex items-center gap-3 w-full p-4 rounded-lg border bg-card text-card-foreground shadow-lg",
          title: "text-sm font-semibold text-foreground",
          description: "text-xs text-muted-foreground",
          success: "border-emerald-500/30 bg-emerald-500/5",
          error: "border-red-500/30 bg-red-500/5",
          warning: "border-amber-500/30 bg-amber-500/5",
          info: "border-blue-500/30 bg-blue-500/5",
          action: "bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-90",
          cancel: "bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-muted/80",
        },
      }}
    />
  );
}