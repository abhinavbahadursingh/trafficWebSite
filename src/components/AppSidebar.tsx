import { Activity, Map, AlertTriangle, ShieldCheck, BarChart3, Radio, Home, LogOut, Video, PlayCircle, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserRole } from "@/types/traffic";

type NavItem = { title: string; url: string; icon: typeof Home; roles: UserRole[] };

const navMain: NavItem[] = [
  { title: "Home", url: "/home", icon: Home, roles: ["admin", "police", "public"] },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["admin", "police", "public"] },
  { title: "Live Map", url: "/map", icon: Map, roles: ["admin", "police", "public"] },
  { title: "Live Cameras", url: "/cameras", icon: Video, roles: ["admin", "police", "public"] },
  { title: "Project Demo", url: "/demo", icon: PlayCircle, roles: ["admin", "police", "public"] },
  { title: "Report Incident", url: "/report", icon: AlertTriangle, roles: ["admin", "police", "public"] },
  { title: "Analytics", url: "/analytics", icon: BarChart3, roles: ["admin", "police", "public"] },
];

const navOps: NavItem[] = [
  { title: "Admin Panel", url: "/admin", icon: ShieldCheck, roles: ["admin", "police"] },
  { title: "Signal Control", url: "/signals", icon: Radio, roles: ["admin", "police"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const visibleMain = navMain.filter((i) => i.roles.includes(user.role));
  const visibleOps = navOps.filter((i) => i.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative h-9 w-9 shrink-0 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm leading-tight">Smart Traffic</p>
              <p className="text-xs text-muted-foreground leading-tight">Live City Ops</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/home"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-300 ${
                          isActive
                            ? "bg-primary/20 text-primary font-bold shadow-[inset_4px_0_0_0_hsl(var(--primary)),0_0_12px_-2px_hsl(var(--primary)/0.3)]"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleOps.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Control</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleOps.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-300 ${
                            isActive
                              ? "bg-primary/20 text-primary font-bold shadow-[inset_4px_0_0_0_hsl(var(--primary)),0_0_12px_-2px_hsl(var(--primary)/0.3)]"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} />
                            {!collapsed && <span className="truncate">{item.title}</span>}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={() => { logout(); navigate("/login"); }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
