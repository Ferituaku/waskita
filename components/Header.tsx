"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Search, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { useSidebar } from "@/hooks/SidebarContext";

interface HeaderProps {
  title: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
  phone_number?: string;
  status?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleMobile } = useSidebar();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile dari cookie (otomatis)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.replace("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Generate display image
  const getDisplayImage = () => {
    if (!user) return `https://ui-avatars.com/api/?name=User&size=100&background=random`;
    
    // Jika ada profile_picture dan bukan default
    if (user.profile_picture && user.profile_picture !== '/default-profile.jpg') {
      // Jika URL eksternal (http/https), gunakan langsung
      if (user.profile_picture.startsWith('http')) {
        return user.profile_picture;
      }
      // Jika path lokal (uploads), tambahkan base URL
      return `http://localhost:3000${user.profile_picture}`;
    }
    
    // Fallback ke UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=100&background=random`;
  };

  const displayImage = getDisplayImage();
  const displayName = user?.name || "User Name";

  return (
    <header
      className="
        sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70
        border-b border-slate-200
      "
    >
      <div className="mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <button
          onClick={toggleMobile}
          className="
            md:hidden flex items-center justify-center h-10 w-10 rounded-lg
            hover:bg-slate-100 active:bg-slate-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C110E]/40
            transition-colors
          "
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6 text-slate-700" />
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h2>

      

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm font-bold text-slate-700">
            {loading ? "Loading..." : displayName}
          </span>
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button
              className="
                relative flex h-10 w-10 items-center justify-center rounded-full
                bg-slate-100 ring-1 ring-inset ring-slate-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C110E]/40
              "
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={displayImage}
                alt={displayName}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=100&background=random`;
                }}
              />
            </HeadlessMenu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items
                className="
                  absolute right-0 z-30 mt-2 w-56 origin-top-right
                  rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                  p-1
                "
              >
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile/edit"
                      className={[
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                        active
                          ? "bg-slate-50 text-slate-900"
                          : "text-slate-700",
                      ].join(" ")}
                    >
                      <User className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  )}
                </HeadlessMenu.Item>
                
                <div className="my-1 h-px bg-slate-200" />

                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={[
                        "w-full text-left flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-slate-700 hover:text-red-600",
                      ].join(" ")}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                  )}
                </HeadlessMenu.Item>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;