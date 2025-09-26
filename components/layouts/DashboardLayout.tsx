import React from "react";
import Sidebar from "../Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
