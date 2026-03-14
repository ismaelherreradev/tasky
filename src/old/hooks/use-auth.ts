"use client";

import { useOrganization, useUser } from "@clerk/nextjs";

export function useAuth() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const isLoaded = userLoaded && orgLoaded;

  const userId = user?.id;
  const orgId = organization?.id;

  const isAuthenticated = !!user && isLoaded;

  const userProfile = user
    ? {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        fullName: user.fullName ?? null,
        imageUrl: user.imageUrl,
        username: user.username ?? null,
      }
    : null;

  const currentOrganization = organization
    ? {
        id: organization.id,
        name: organization.name ?? null,
        slug: organization.slug ?? null,
        imageUrl: organization.imageUrl ?? null,
        role: (organization.publicMetadata?.role as string) ?? undefined,
      }
    : null;

  const orgRole = (organization?.publicMetadata?.role as string) ?? "";
  const isOrganizationOwner = orgRole === "owner";
  const isOrganizationAdmin = ["owner", "admin"].includes(orgRole);

  const hasRole = (role: string) => {
    return orgRole === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(orgRole);
  };

  return {
    user: userProfile,
    userId,
    organization: currentOrganization,
    orgId,
    isLoaded,
    isAuthenticated,
    isOrganizationOwner,
    isOrganizationAdmin,
    hasRole,
    hasAnyRole,
  };
}
