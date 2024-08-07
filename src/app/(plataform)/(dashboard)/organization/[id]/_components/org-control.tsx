"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function OrgControl() {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    void setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);

  return null;
}
