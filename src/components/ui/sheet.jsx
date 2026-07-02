import { createContext, useContext, useState } from "react";
import * as React from "react";
import { cn } from "../../lib/utils";

const SheetContext = createContext({});

const Sheet = ({ children, open, defaultOpen, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);

  React.useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <SheetContext.Provider value={{ isOpen, handleClose }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { handleClose } = useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: (e) => {
        handleClose();
        children.props.onClick?.(e);
      },
      ...props,
    });
  }
  return (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { handleClose } = useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: (e) => {
        handleClose();
        children.props.onClick?.(e);
      },
      ...props,
    });
  }
  return (
    <button ref={ref} type="button" onClick={() => handleClose()} {...props}>
      {children}
    </button>
  );
});
SheetClose.displayName = "SheetClose";

const SheetContent = React.forwardRef(({ className, children, side = "left", ...props }, ref) => {
  const { isOpen, handleClose } = useContext(SheetContext);

  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    top: "inset-x-0 top-0 border-b h-auto",
    bottom: "inset-x-0 bottom-0 border-t h-auto",
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 cursor-default"
        onClick={() => handleClose()}
      />
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-card border-border shadow-xl transition-transform duration-300",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2 p-4 border-b border-border", className)} {...props} />
));
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

const SheetFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col-reverse p-4 border-t border-border sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
));
SheetFooter.displayName = "SheetFooter";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter };