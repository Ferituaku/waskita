"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpenText,
  ClipboardCheck,
  Youtube,
  ChevronsLeft,
  ChevronsRight,
  CircleQuestionMark,
  Users,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { useSidebar } from "@/hooks/SidebarContext";
import { cn } from "@/lib/utils";

// Tipe untuk menu item
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// Menu untuk ADMIN
const adminNavLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materi", label: "Materi", icon: BookOpenText },
  { href: "/quiz", label: "Kelola Quiz", icon: ClipboardCheck },
  { href: "/video-edukasi", label: "Video Edukasi", icon: Youtube },
  { href: "/users-management", label: "Kelola User", icon: Users },
];

// Menu untuk USER BIASA
const userNavLinks: NavLink[] = [
  { href: "/apa-itu-wpa", label: "Apa itu WPA", icon: CircleQuestionMark },
  { href: "/beranda", label: "Beranda", icon: Home },
  // { href: "/materi", label: "Materi", icon: BookOpenText },
  { href: "/quiz-user", label: "Quiz", icon: ClipboardCheck },
  // { href: "/video-edukasi", label: "Video Edukasi", icon: Youtube },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    isMobileOpen,
    isDesktopCollapsed,
    closeMobile,
    toggleDesktopCollapse,
  } = useSidebar();

  // State untuk menyimpan role user
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data saat component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Pilih navLinks berdasarkan role
  const navLinks = userRole === "admin" ? adminNavLinks : userNavLinks;

  // Tampilkan loading state
  if (isLoading) {
    return (
      <aside
        className={cn(
          "flex flex-col bg-gradient-to-b from-[#5C110E] to-[#3b0a09] text-white border-r border-black/10 shadow-sm",
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          "-translate-x-full md:translate-x-0",
          isDesktopCollapsed ? "md:w-20" : "w-72"
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"
              suppressHydrationWarning
            ></div>
          </div>
        </div>
      </aside>
    );
  }

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
          "flex flex-col bg-gradient-to-b from-[#5C110E] to-[#3b0a09] text-white border-r border-black/10 shadow-sm transition-all duration-300 ease-out",
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
            "px-6 py-5 border-b border-white/10 transition-all duration-300 ease-out",
            isDesktopCollapsed && "md:px-3"
          )}
        >
          <div className="flex items-center justify-center relative h-14 overflow-hidden">
            {/* Logo kecil saat diciutkan */}
            <div
              className={cn(
                "absolute transition-opacity duration-200 ease-out",
                isDesktopCollapsed ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src="/favicon.png"
                alt="Waskita Logo Small"
                width={40}
                height={40}
                priority
                className="drop-shadow-sm"
              />
            </div>
            {/* Logo besar saat diperluas */}
            <div
              className={cn(
                "absolute transition-opacity duration-200 ease-out",
                isDesktopCollapsed ? "opacity-0" : "opacity-100"
              )}
            >
              <Image
                src="/logo-waskitabystophiva(putih).png"
                alt="Waskita Logo"
                width={180}
                height={60}
                priority
                className="drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Badge Role (opsional) */}
        {!isDesktopCollapsed && userRole && (
          <div className="px-6 py-3">
            <div
              className={cn(
                "text-xs font-semibold px-3 py-1 rounded-full text-center",
                userRole === "admin"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              )}
            >
              {userRole === "admin" ? "ADMIN" : "USER"}
            </div>
          </div>
        )}

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
                  "group flex items-center gap-3 rounded-xl px-3 py-2",
                  "transition-colors duration-200 ease-out",
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
                    "font-medium tracking-tight whitespace-nowrap",
                    "transition-opacity duration-300 ease-out",
                    isDesktopCollapsed ? "md:hidden" : "opacity-100"
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
                hover:bg-white/5 hover:text-white transition-colors duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
              title={isDesktopCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            >
              <div className="w-full flex justify-center items-center">
                {isDesktopCollapsed ? (
                  <ChevronsRight className="h-5 w-5 opacity-90" />
                ) : (
                  <ChevronsLeft className="h-5 w-5 opacity-90" />
                )}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
