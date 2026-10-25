"use client";

import { useDashboardSession } from "@/components/layout/dashboard-session-provider";

export function WriteAccessOnly({ children }: { children: React.ReactNode }) {
  const user = useDashboardSession();
  return user.readOnly ? null : children;
}
