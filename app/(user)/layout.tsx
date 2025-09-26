import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  // tambahan logic khusus user di sini jika perlu
  return <DashboardLayout>{children}</DashboardLayout>;
}
