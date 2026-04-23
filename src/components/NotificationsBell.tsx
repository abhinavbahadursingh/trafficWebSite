import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useTraffic } from "@/stores/trafficStore";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function NotificationsBell() {
  const notifications = useTraffic((s) => s.notifications);
  const markAllRead = useTraffic((s) => s.markAllRead);
  const lastSeenRef = useRef<string | null>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const latest = notifications[0];
    if (!latest) return;
    if (lastSeenRef.current && latest.id !== lastSeenRef.current && !latest.read) {
      toast(latest.title, {
        description: latest.body,
        className:
          latest.level === "critical"
            ? "border-destructive/40"
            : latest.level === "warning"
            ? "border-warning/40"
            : "border-primary/30",
      });
    }
    lastSeenRef.current = latest.id;
  }, [notifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <p className="font-display font-semibold text-sm">Notifications</p>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
            Mark all read
          </Button>
        </div>
        <div className="max-h-[360px] overflow-auto scrollbar-thin">
          {notifications.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="p-3 border-b last:border-b-0 hover:bg-muted/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <Badge
                  variant="outline"
                  className={
                    n.level === "critical"
                      ? "border-destructive/40 text-destructive"
                      : n.level === "warning"
                      ? "border-warning/40 text-warning"
                      : "border-primary/30 text-primary"
                  }
                >
                  {n.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
