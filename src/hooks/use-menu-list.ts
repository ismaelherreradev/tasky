import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import {
  Bookmark,
  LayoutGrid,
  type LucideIcon,
  Settings,
  SquarePen,
  Tag,
  Users,
} from "lucide-react";
import { useMemo } from "react";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

const baseMenus: Menu[] = [
  {
    href: "/organization",
    label: "Workspaces",
    active: false,
    icon: LayoutGrid,
  },
];

const contentMenus: Menu[] = [
  {
    href: "/post",
    label: "Posts",
    active: false,
    icon: SquarePen,
    submenus: [
      { href: "/posts", label: "All Posts", active: false },
      { href: "/posts/new", label: "New Post", active: false },
    ],
  },
  { href: "/categories", label: "Categories", active: false, icon: Bookmark },
  { href: "/tags", label: "Tags", active: false, icon: Tag },
];

const settingsMenus: Menu[] = [
  { href: "/users", label: "Users", active: false, icon: Users },
  { href: "/account", label: "Account", active: false, icon: Settings },
];

function addSubmenusToMenu(
  menus: Menu[],
  predicate: (menu: Menu) => boolean,
  submenus: Submenu[],
): Menu[] {
  return menus.map((menu) => (predicate(menu) ? { ...menu, submenus } : menu));
}

function generateWorkspaceSubmenus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  userMemberships: any,
  activeWorkspaceId: string | null,
): Submenu[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    userMemberships.data?.map(
      (membership: { organization: { id: string | null; name: string } }) => ({
        href: `/organization/${membership.organization?.id ?? ""}`,
        label: membership.organization?.name || "Unknown Workspace",
        active: activeWorkspaceId === membership.organization?.id,
      }),
    ) || []
  );
}

function setMenuActiveState(menus: Menu[], pathname: string): Menu[] {
  return menus.map((menu) => ({
    ...menu,
    active: pathname.includes(menu.href),
    submenus: menu.submenus?.map((submenu) => ({
      ...submenu,
      active: pathname.includes(submenu.href),
    })),
  }));
}

export function useMenuList(pathname: string): Group[] {
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  return useMemo(() => {
    if (!isLoadedOrg || !isLoadedOrgList) {
      return [];
    }

    const workspaceSubmenus = generateWorkspaceSubmenus(
      userMemberships,
      activeOrganization ? activeOrganization.id : "",
    );

    const updatedBaseMenus = addSubmenusToMenu(
      baseMenus,
      (menu) => menu.href === "/organization",
      workspaceSubmenus,
    );

    const baseMenusWithActiveState = setMenuActiveState(
      updatedBaseMenus,
      pathname,
    );
    const contentMenusWithActiveState = setMenuActiveState(
      contentMenus,
      pathname,
    );
    const settingsMenusWithActiveState = setMenuActiveState(
      settingsMenus,
      pathname,
    );

    return [
      {
        groupLabel: "",
        menus: baseMenusWithActiveState,
      },
      {
        groupLabel: "Contents",
        menus: contentMenusWithActiveState,
      },
      {
        groupLabel: "Settings",
        menus: settingsMenusWithActiveState,
      },
    ];
  }, [
    activeOrganization,
    isLoadedOrg,
    isLoadedOrgList,
    pathname,
    userMemberships,
  ]);
}
