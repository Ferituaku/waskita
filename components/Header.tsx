import React, { Fragment } from "react";
import { Search, User, Users, LogOut } from "lucide-react";
import Link from "next/link";
// TAMBAHKAN: Import Menu.Button, Menu.Items, dan Menu.Item secara eksplisit agar lebih jelas
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          type="text"
          placeholder="Jelajahi Halaman..."
          className="w-full pl-10 pr-4 py-2 text-gray-400 border border-gray-600 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700 hidden sm:block">
          Nama Pengguna
        </span>

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          {/* UBAH BAGIAN INI: Ganti <div> dan <button> dengan <Menu.Button> */}
          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
            <span className="sr-only">Open user menu</span>
            <Image
              className="h-10 w-10 rounded-full object-cover"
              height={40}
              width={40}
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile/edit"
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/users"
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <Users className="mr-3 h-4 w-4" />
                    <span>User Manajemen</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => console.log("User logged out")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 text-left`}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
