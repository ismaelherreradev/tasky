import { OrgControl } from "./_components/org-control";

export default function OrganizationIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen">
      <OrgControl />
      {children}
    </main>
  );
}
