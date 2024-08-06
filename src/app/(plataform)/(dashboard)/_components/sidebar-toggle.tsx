import { ChevronLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SidebarToggleProps = {
  isOpen: boolean | undefined;
  toggleSidebar?: () => void;
};

export function SidebarToggle({ isOpen, toggleSidebar }: SidebarToggleProps) {
  return (
    <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
      <Button
        onClick={() => toggleSidebar?.()}
        className="h-8 w-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-700 ease-in-out",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
