import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "zustand";
import { Menu } from "~/components/menu";
import { Button } from "~/components/ui/button";
import useSidebarToggle from "~/hooks/use-sidebar-toggle";
import { cn } from "~/lib/utils";
import { SidebarToggle } from "./sidebar-toggle";

type BrandProps = {
  isOpen: boolean;
};

function Brand({ isOpen }: BrandProps) {
  return (
    <Button
      className={cn(
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-1",
      )}
      variant="link"
      asChild
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <PanelsTopLeft className="mr-1 h-6 w-6" />
        <h1
          className={cn(
            "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
            isOpen
              ? "translate-x-0 opacity-100"
              : "hidden -translate-x-96 opacity-0",
          )}
        >
          Tasky
        </h1>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const isOpen = useStore(useSidebarToggle, (state) => state.isOpen);

  const toggleSidebar = useStore(
    useSidebarToggle,
    (state) => state.toggleSidebar,
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "w-72" : "w-[90px]",
      )}
    >
      <SidebarToggle isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Brand isOpen={isOpen} />
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
}
