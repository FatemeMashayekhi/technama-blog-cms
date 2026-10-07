"use client";

import { createContext, useContext } from "react";
import { defaultDashboardUser, type DashboardUser } from "@/lib/dashboard-data";

const DashboardSessionContext = createContext<DashboardUser>(defaultDashboardUser);

export function DashboardSessionProvider({ user, children }: { user: DashboardUser; children: React.ReactNode }) {
  return <DashboardSessionContext.Provider value={user}>{children}</DashboardSessionContext.Provider>;
}

export function useDashboardSession() {
  return useContext(DashboardSessionContext);
}
