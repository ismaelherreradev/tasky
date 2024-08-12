"use client";

import { OrganizationProfile } from "@clerk/nextjs";
import { dark, experimental__simple } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function OrganizationProfileSettings() {
  const { theme } = useTheme();

  return (
    <OrganizationProfile
      routing="hash"
      appearance={{
        baseTheme: theme === "dark" ? dark : experimental__simple,
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
