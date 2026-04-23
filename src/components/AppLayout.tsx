import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsBell } from "@/components/NotificationsBell";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/map": "Live Traffic Map",
  "/report": "Report Incident",
  "/admin": "Admin Panel",
  "/signals": "Signal Control",
  "/analytics": "Analytics",
};

export function AppLayout() {
  const location = useLocation();
  const title = titles[location.pathname] ?? "Smart Traffic";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border glass px-4">
            <SidebarTrigger className="shrink-0" />
            <div className="hidden md:block">
              <h1 className="font-display font-semibold text-base leading-none">{title}</h1>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center relative w-64">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search location, road, incident…" className="pl-9 h-9 bg-surface-2/60" />
            </div>
            <NotificationsBell />
            <ThemeToggle />
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
