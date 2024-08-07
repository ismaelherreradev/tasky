import {
  Bookmark,
  LayoutGrid,
  type LucideIcon,
  Settings,
  SquarePen,
  Tag,
  Users,
} from "lucide-react";

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
  { href: "/dashboard", label: "Workspaces", active: false, icon: LayoutGrid },
];

const contentMenus: Menu[] = [
  {
    href: "",
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

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: baseMenus.map((menu) => ({
        ...menu,
        active: pathname.includes("/dashboard"),
      })),
    },
    {
      groupLabel: "Contents",
      menus: contentMenus.map((menu) => ({
        ...menu,
        active:
          pathname.includes("/posts") ||
          pathname.includes("/categories") ||
          pathname.includes("/tags"),
      })),
    },
    {
      groupLabel: "Settings",
      menus: settingsMenus.map((menu) => ({
        ...menu,
        active: pathname.includes("/users") || pathname.includes("/account"),
      })),
    },
  ];
}
