import React, { Fragment } from "react";
import { Search, User, Users, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import Image from "next/image";
import { useSidebar } from "@/hooks/SidebarContext";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleMobile } = useSidebar();

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
            User Name
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
              <Image
                className="h-10 w-10 rounded-full object-cover"
                height={40}
                width={40}
                src="https://i.pravatar.cc/80?img=1"
                alt="User Avatar"
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
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <Link
                      href="/login"
                      onClick={() => console.log("User logged out")}
                      className={[
                        "w-full text-left flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                        active
                          ? "bg-slate-50 text-slate-900"
                          : "text-slate-700",
                      ].join(" ")}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
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
