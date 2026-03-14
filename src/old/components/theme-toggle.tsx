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
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
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
      className="relative h-8 w-8 overflow-hidden rounded-md border border-border/40 px-0 transition-all duration-200 hover:scale-105 hover:border-border"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon className="h-4 w-4 text-foreground" />
        ) : (
          <SunIcon className="h-4 w-4 text-foreground" />
        )}
      </div>

      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-4 w-4 text-foreground" />
        ) : (
          <MoonIcon className="h-4 w-4 text-foreground" />
        )}
      </div>
    </Button>
  );
}
