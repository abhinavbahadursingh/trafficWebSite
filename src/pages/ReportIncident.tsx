import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Car, Construction, AlertTriangle, ImagePlus, Loader2, MapPin, X } from "lucide-react";
import { TrafficMap } from "@/components/map/TrafficMap";
import { useTraffic } from "@/stores/trafficStore";
import { useAuth } from "@/stores/authStore";
import { z } from "zod";
import { toast } from "sonner";
import type { IncidentType } from "@/types/traffic";

const schema = z.object({
  type: z.enum(["accident", "jam", "roadblock"]),
  description: z.string().trim().min(8, "Add a short description (min 8 chars)").max(500),
  lat: z.number(),
  lng: z.number(),
  address: z.string().max(200).optional(),
});

export default function ReportIncident() {
  const [type, setType] = useState<IncidentType>("accident");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { reportIncident } = useTraffic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast.error("Image must be under 4 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!point) { toast.error("Click on the map to pick the incident location"); return; }
    const parsed = schema.safeParse({ type, description, lat: point.lat, lng: point.lng, address });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    reportIncident({
      type, description, lat: point.lat, lng: point.lng,
      address: address.trim() || `Lat ${point.lat.toFixed(3)}, Lng ${point.lng.toFixed(3)}`,
      imageDataUrl,
      reportedBy: user?.id ?? "anon",
      reportedByName: user?.name ?? "Anonymous",
    });
    toast.success("Incident reported. Awaiting review.");
    setSubmitting(false);
    navigate("/dashboard");
  };

  const types: { value: IncidentType; label: string; icon: any }[] = [
    { value: "accident", label: "Accident", icon: AlertTriangle },
    { value: "jam", label: "Traffic Jam", icon: Car },
    { value: "roadblock", label: "Road Block", icon: Construction },
  ];

  return (
    <div className="p-4 md:p-6 grid lg:grid-cols-5 gap-4 max-w-[1600px] mx-auto">
      <Card className="lg:col-span-2 p-5 bg-card/60 border-border space-y-5 h-fit">
        <div>
          <h2 className="font-display text-xl font-semibold">Report an incident</h2>
          <p className="text-sm text-muted-foreground">Help your city respond faster.</p>
        </div>

        <div className="space-y-2">
          <Label>Incident type</Label>
          <ToggleGroup
            type="single" value={type}
            onValueChange={(v) => v && setType(v as IncidentType)}
            className="grid grid-cols-3 gap-2"
          >
            {types.map((t) => (
              <ToggleGroupItem
                key={t.value}
                value={t.value}
                className="flex flex-col gap-1 h-auto py-3 border border-border data-[state=on]:bg-primary/15 data-[state=on]:border-primary data-[state=on]:text-primary"
              >
                <t.icon className="h-5 w-5" />
                <span className="text-xs">{t.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <div className="flex items-center gap-2 rounded-lg border border-border p-3 bg-surface-2/40">
            <MapPin className="h-4 w-4 text-primary" />
            {point ? (
              <span className="text-sm font-mono">
                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Tap the map to pick a point</span>
            )}
            {point && (
              <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => setPoint(null)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addr">Address / nearby landmark (optional)</Label>
          <Input id="addr" value={address} maxLength={200} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Mission & 7th" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc" rows={4} maxLength={500}
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what happened…"
          />
          <p className="text-[10px] text-muted-foreground text-right">{description.length}/500</p>
        </div>

        <div className="space-y-2">
          <Label>Photo (optional)</Label>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          {imageDataUrl ? (
            <div className="relative">
              <img src={imageDataUrl} alt="Incident preview" className="w-full max-h-48 object-cover rounded-lg border border-border" />
              <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImageDataUrl(undefined)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <button
              type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-6 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center gap-1.5"
            >
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload an image (max 4 MB)</span>
            </button>
          )}
        </div>

        <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit report
        </Button>
      </Card>

      <Card className="lg:col-span-3 p-2 bg-card/60 border-border overflow-hidden">
        <div className="h-[600px] lg:h-[calc(100vh-7rem)]">
          <TrafficMap
            onMapClick={(lat, lng) => setPoint({ lat, lng })}
            pickedPoint={point}
          />
        </div>
      </Card>
    </div>
  );
}
