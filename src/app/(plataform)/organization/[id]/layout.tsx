import { OrgControl } from "./_components/org-control";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
