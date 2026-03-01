"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [toggled, setToggled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    if (toggled) {
      timeoutId = setTimeout(() => {
        setToggled(false);
      }, 200);
    }
    return () => clearTimeout(timeoutId);
  }, [toggled]);

  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 overflow-hidden rounded-full px-0"
        disabled
      >
        <div className="bg-muted h-4 w-4 animate-pulse rounded" />
      </Button>
    );
  }

  function toggleTheme() {
    setToggled(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="border-border/40 hover:border-border relative h-8 w-8 overflow-hidden rounded-md border px-0 transition-all duration-200 hover:scale-105"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon className="text-foreground h-4 w-4" />
        ) : (
          <SunIcon className="text-foreground h-4 w-4" />
        )}
      </div>

      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="text-foreground h-4 w-4" />
        ) : (
          <MoonIcon className="text-foreground h-4 w-4" />
        )}
      </div>
    </Button>
  );
}
