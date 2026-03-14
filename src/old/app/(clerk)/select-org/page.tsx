"use client";;
import { OrganizationList } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { simple } from "@clerk/ui/themes/experimental";
import { useTheme } from "next-themes";

export default function OrganizationListPage() {
  const { theme } = useTheme();
  return (
    <OrganizationList
      appearance={{ theme: theme === "dark" ? dark : simple }}
      hidePersonal
      afterCreateOrganizationUrl="/organization/:id"
      afterSelectOrganizationUrl="/organization/:id"
    />
  );
}
