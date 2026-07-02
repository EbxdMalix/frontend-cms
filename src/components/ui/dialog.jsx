import * as React from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import { cn } from "../../lib/utils";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay onClick={() => onOpenChange?.(false)} />
      <DialogContentContainer>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onOpenChange });
          }
          return child;
        })}
      </DialogContentContainer>
    </DialogPortal>
  );
};

const DialogPortal = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {children}
    </div>,
    document.body
  );
};

const DialogOverlay = ({ className, ...props }) => (
  <div
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-default",
      className
    )}
    {...props}
  />
);

const DialogContentContainer = ({ children }) => (
  <div className="relative z-50 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
    {children}
  </div>
);

const DialogContent = React.forwardRef(({ className, children, onOpenChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative bg-card border border-border rounded-xl shadow-2xl p-6 text-foreground flex flex-col gap-4 overflow-hidden select-none",
      className
    )}
    {...props}
  >
    {children}
    <button
      onClick={() => onOpenChange?.(false)}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
    >
      <FiX className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  </div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
