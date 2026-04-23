import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Check, X, RotateCcw, MapPin } from "lucide-react";
import { useTraffic } from "@/stores/trafficStore";
import { TrafficMap } from "@/components/map/TrafficMap";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { IncidentStatus, IncidentType } from "@/types/traffic";

export default function AdminPanel() {
  const incidents = useTraffic((s) => s.incidents);
  const setIncidentStatus = useTraffic((s) => s.setIncidentStatus);
  const [type, setType] = useState<IncidentType | "all">("all");
  const [status, setStatus] = useState<IncidentStatus | "all">("all");
  const [q, setQ] = useState("");

  const filtered = incidents.filter((i) => {
    if (type !== "all" && i.type !== type) return false;
    if (status !== "all" && i.status !== status) return false;
    if (q && !`${i.description} ${i.address ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const counts = {
    pending: incidents.filter((i) => i.status === "pending").length,
    approved: incidents.filter((i) => i.status === "approved").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
    rejected: incidents.filter((i) => i.status === "rejected").length,
  };

  const action = (id: string, next: IncidentStatus, label: string) => {
    setIncidentStatus(id, next);
    toast.success(`Incident ${label}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Incident control</h2>
          <p className="text-sm text-muted-foreground">Approve, dispatch, and resolve reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: "Pending", v: counts.pending, c: "border-warning/40 text-warning" },
          { k: "Approved", v: counts.approved, c: "border-info/40 text-info" },
          { k: "Resolved", v: counts.resolved, c: "border-success/40 text-success" },
          { k: "Rejected", v: counts.rejected, c: "border-destructive/40 text-destructive" },
        ].map((s) => (
          <Card key={s.k} className="p-4 bg-card/60 border-border">
            <Badge variant="outline" className={s.c}>{s.k}</Badge>
            <p className="font-display text-3xl font-semibold mt-3">{s.v}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="map">Map view</TabsTrigger>
        </TabsList>

        <Card className="p-4 bg-card/60 border-border mt-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search description or address…" className="pl-9 h-9" />
            </div>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="jam">Traffic jam</SelectItem>
                <SelectItem value="roadblock">Road block</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <TabsContent value="list" className="mt-3 space-y-3">
          {filtered.length === 0 && (
            <Card className="p-12 text-center text-sm text-muted-foreground border-dashed">No incidents match your filters.</Card>
          )}
          {filtered.map((inc) => (
            <Card key={inc.id} className="p-4 bg-card/60 border-border hover:border-primary/30 transition-colors">
              <div className="flex flex-wrap items-start gap-4">
                {inc.imageDataUrl && (
                  <img src={inc.imageDataUrl} alt="" className="h-20 w-28 object-cover rounded-lg border border-border" />
                )}
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold capitalize">{inc.type}</span>
                    <Badge
                      variant="outline"
                      className={
                        inc.status === "pending" ? "border-warning/40 text-warning" :
                        inc.status === "approved" ? "border-info/40 text-info" :
                        inc.status === "resolved" ? "border-success/40 text-success" :
                        "border-destructive/40 text-destructive"
                      }
                    >
                      {inc.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {inc.address}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{inc.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reported by {inc.reportedByName} • {formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {inc.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="border-success/40 text-success hover:bg-success/10" onClick={() => action(inc.id, "approved", "approved")}>
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => action(inc.id, "rejected", "rejected")}>
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {inc.status === "approved" && (
                    <Button size="sm" className="bg-success text-success-foreground hover:opacity-90" onClick={() => action(inc.id, "resolved", "resolved")}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Mark resolved
                    </Button>
                  )}
                  {(inc.status === "rejected" || inc.status === "resolved") && (
                    <Button size="sm" variant="ghost" onClick={() => action(inc.id, "pending", "reopened")}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reopen
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="map" className="mt-3">
          <Card className="p-2 bg-card/60 border-border overflow-hidden">
            <div className="h-[640px]"><TrafficMap /></div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
