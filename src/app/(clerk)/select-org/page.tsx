"use client";

import { OrganizationList } from "@clerk/nextjs";
import { dark, experimental__simple } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function OrganizationListPage() {
  const { theme } = useTheme();
  return (
    <OrganizationList
      appearance={{ baseTheme: theme === "dark" ? dark : experimental__simple }}
      hidePersonal
      afterCreateOrganizationUrl="/organization/:id"
      afterSelectOrganizationUrl="/organization/:id"
    />
  );
}
