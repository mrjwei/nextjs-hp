"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "./analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
}
