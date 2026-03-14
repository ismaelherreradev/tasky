"use client";

import { useEffect, useRef } from "react";

interface ScreenReaderAnnouncementsProps {
  announcement: string | null;
  clearAfter?: number;
}

export function ScreenReaderAnnouncements({
  announcement,
  clearAfter = 3000,
}: ScreenReaderAnnouncementsProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcement && announcementRef.current) {
      announcementRef.current.textContent = "";

      const timer = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = announcement;
        }
      }, 100);

      const clearTimer = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = "";
        }
      }, clearAfter);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [announcement, clearAfter]);

  return (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
