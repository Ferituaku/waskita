"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  toggleDesktopCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  const toggleDesktopCollapse = () => setIsDesktopCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        isDesktopCollapsed,
        toggleMobile,
        closeMobile,
        toggleDesktopCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
