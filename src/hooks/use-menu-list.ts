import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import {
  Bookmark,
  LayoutGrid,
  LayoutPanelLeft,
  type LucideIcon,
  Settings,
  SquarePen,
  Tag,
  Users,
} from "lucide-react";
import { useMemo } from "react";

// Define types for menu items
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon | string;
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

// Define initial menu items
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
    href: "/board",
    label: "Boards",
    active: false,
    icon: LayoutPanelLeft,
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

/**
 * Utility function to add submenus to a menu
 *
 * @param {Menu[]} menus - The array of menus to update.
 * @param {(menu: Menu) => boolean} predicate - A function that determines which menu to add submenus to.
 * @param {Submenu[]} submenus - The array of submenus to add.
 * @returns {Menu[]} - The updated array of menus with submenus added.
 */
function addSubmenusToMenu(
  menus: Menu[],
  predicate: (menu: Menu) => boolean,
  submenus: Submenu[],
): Menu[] {
  return menus.map((menu) => (predicate(menu) ? { ...menu, submenus } : menu));
}

/**
 * Generates submenus for workspaces based on user memberships and the active workspace.
 *
 * @param {{ data: { organization: { id: string | null; name: string } }[] } | undefined} userMemberships - The user's organization memberships.
 * @param {string | null} activeWorkspaceId - The ID of the currently active workspace.
 * @returns {Submenu[]} - The array of workspace submenus.
 */
function generateWorkspaceSubmenus(
  userMemberships:
    | {
        data: {
          organization: { id: string | null; name: string; imageUrl: string };
        }[];
      }
    | undefined,
  activeWorkspaceId: string | null,
): Submenu[] {
  if (!userMemberships?.data) {
    return [];
  }

  return userMemberships.data.map((membership) => ({
    href: `/organization/${membership.organization?.id ?? ""}`,
    label: membership.organization?.name || "Unknown Workspace",
    active: activeWorkspaceId === membership.organization?.id,
    icon: membership.organization.imageUrl,
  }));
}

/**
 * Sets the active state for menus and submenus based on the current pathname.
 *
 * @param {Menu[]} menus - The array of menus to update.
 * @param {string} pathname - The current pathname.
 * @returns {Menu[]} - The updated array of menus with active states set.
 */
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

/**
 * Generates the skeleton structure for the menu items.
 *
 * @returns {Group[]} - The array of menu groups with skeleton structure.
 */
function generateSkeletonMenu(): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/organization",
          label: "Loading...",
          active: false,
          icon: LayoutGrid,
          submenus: [{ href: "/", label: "Loading...", active: false }],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/post",
          label: "Post",
          active: false,
          icon: SquarePen,
          submenus: [{ href: "/", label: "Post", active: false }],
        },
        {
          href: "/categories",
          label: "Categories",
          active: false,
          icon: Bookmark,
        },
        { href: "/tags", label: "Tags", active: false, icon: Tag },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        { href: "/users", label: "Users", active: false, icon: Users },
        {
          href: "/account",
          label: "Account",
          active: false,
          icon: Settings,
        },
      ],
    },
  ];
}

/**
 * Hook to generate the menu list based on the current pathname and user memberships.
 *
 * @param {string} pathname - The current pathname.
 * @returns {Group[]} - The array of menu groups.
 */
export function useMenuList(pathname: string): Group[] {
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  return useMemo(() => {
    // Return empty array if data is not loaded
    if (!isLoadedOrg || !isLoadedOrgList) {
      return generateSkeletonMenu();
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
