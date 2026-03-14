"use client";;
import { OrganizationProfile } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { simple } from "@clerk/ui/themes/experimental";
import { useTheme } from "next-themes";

export default function OrganizationProfileSettings() {
  const { theme } = useTheme();

  return (
    <OrganizationProfile
      routing="hash"
      appearance={{
        theme: theme === "dark" ? dark : simple,
        elements: {
          rootBox: {
            boxShadow: "none",
            width: "100%",
          },
          cardBox: {
            display: "flex",
            width: "100%",
          },
        },
      }}
    />
  );
}
