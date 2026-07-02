import { createContext, useContext, useState } from "react";
import * as React from "react";
import { cn } from "../../lib/utils";

const TooltipContext = createContext({});

const TooltipProvider = ({ children, delayDuration = 300 }) => (
  <TooltipContext.Provider value={{ delayDuration }}>
    {children}
  </TooltipContext.Provider>
);

const Tooltip = ({ children, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setIsOpen, delayDuration } = useContext(TooltipContext);
  const timerRef = React.useRef();

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setIsOpen(true), delayDuration);
  };
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onMouseEnter: (e) => { handleMouseEnter(); children.props.onMouseEnter?.(e); },
      onMouseLeave: (e) => { handleMouseLeave(); children.props.onMouseLeave?.(e); },
      onFocus: (e) => { setIsOpen(true); children.props.onFocus?.(e); },
      onBlur: (e) => { setIsOpen(false); children.props.onBlur?.(e); },
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => {
  const { isOpen } = useContext(TooltipContext);
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-popover border border-border px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };