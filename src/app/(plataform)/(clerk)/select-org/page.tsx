import { OrganizationList } from "@clerk/nextjs";

export default async function OrganizationListPage() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl="/organization/:id"
      afterSelectOrganizationUrl="/organization/:id"
    />
  );
}
