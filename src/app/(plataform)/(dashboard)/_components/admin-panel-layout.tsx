"use client";

import { useStore } from "zustand";
import useSidebarToggle from "~/hooks/use-sidebar-toggle";
import { cn } from "~/lib/utils";
import { Sidebar } from "./sidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useStore(useSidebarToggle, (state) => state.isOpen);

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
          isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      ></footer>
    </>
  );
}
