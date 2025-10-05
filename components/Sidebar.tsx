"use client";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpenText,
  ClipboardCheck,
  Youtube,
  RefreshCw,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  CircleQuestionMark,
} from "lucide-react";
import Image from "next/image";
import { useSidebar } from "@/hooks/SidebarContext";
import { cn } from "@/lib/utils";


const navLinks = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/apa-itu-wpa", label: "Apa itu WPA", icon: CircleQuestionMark },
  { href: "/materi", label: "Materi", icon: BookOpenText },
  { href: "/quiz", label: "Quiz", icon: ClipboardCheck },
  { href: "/video-edukasi", label: "Video Edukasi", icon: Youtube },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    isMobileOpen,
    isDesktopCollapsed,
    closeMobile,
    toggleDesktopCollapse,
  } = useSidebar();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          // Base styles
          "flex flex-col bg-gradient-to-b from-[#5C110E] to-[#3b0a09] text-white border-r border-black/10 shadow-sm transition-all duration-300",
          // Mobile styles - fixed overlay
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          // Mobile visibility
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop width based on collapsed state
          isDesktopCollapsed ? "md:w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "px-6 py-5 border-b border-white/10 transition-all duration-300",
            isDesktopCollapsed && "md:px-3"
          )}
        >
          <div className="flex items-center justify-center">
            {isDesktopCollapsed ? (
              <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl font-bold">
                W
              </div>
            ) : (
              <Image
                src="/logo-waskitabystophiva(putih).png"
                alt="Waskita Logo"
                width={180}
                height={60}
                priority
                className="drop-shadow-sm"
              />
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/10"
                    : "text-gray-200 hover:bg-white/5 hover:text-white",
                  isDesktopCollapsed && "md:justify-center"
                )}
                title={isDesktopCollapsed ? label : undefined}
              >
                <Icon className="h-5 w-5 opacity-90 flex-shrink-0" />
                <span
                  className={cn(
                    "font-medium tracking-tight",
                    isDesktopCollapsed && "md:hidden"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10">
          {/* Desktop collapse toggle button */}
          <div className="hidden md:block px-3 py-3">
            <button
              onClick={toggleDesktopCollapse}
              className="
                w-full flex items-center gap-3 rounded-xl px-3 py-2 text-gray-200
                hover:bg-white/5 hover:text-white transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
              title={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isDesktopCollapsed ? (
                <ChevronsRight className="h-5 w-5 opacity-90 mx-auto" />
              ) : (
                <>
                  <ChevronsLeft className="h-5 w-5 opacity-90" />
                  <span className="font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
          {/* Logout link */}
          <div className="px-3 py-3">
            <Link
              href="/login"
              onClick={closeMobile}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-gray-200",
                "hover:bg-white/5 hover:text-white transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                isDesktopCollapsed && "md:justify-center"
              )}
              title={isDesktopCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 opacity-90 flex-shrink-0" />
              <span
                className={cn("font-medium", isDesktopCollapsed && "md:hidden")}
              >
                Logout
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
