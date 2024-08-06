import AdminPanelLayout from "./_components/admin-panel-layout";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
