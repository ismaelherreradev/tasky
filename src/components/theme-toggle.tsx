"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

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

  if (!isMounted) return null;

  function toggleTheme() {
    setToggled(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      className="relative w-8 h-8 flex items-center justify-center rounded-full bg-background border border-input overflow-hidden"
      onClick={toggleTheme}
      aria-label="Switch Theme"
      variant="outline"
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 transform ${
          toggled ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
      </div>
    </Button>
  );
}
