import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Car, Construction, AlertTriangle, ImagePlus, Loader2, MapPin, X, Navigation } from "lucide-react";
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
    if (!point) {
      toast.error("Location Required", {
        description: "Please click on the map to pick the incident location."
      });
      return;
    }
    const parsed = schema.safeParse({ type, description, lat: point.lat, lng: point.lng, address });
    if (!parsed.success) {
      toast.error("Invalid Form", {
        description: parsed.error.issues[0].message
      });
      return;
    }
    setSubmitting(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    
    reportIncident({
      type,
      description,
      lat: point.lat,
      lng: point.lng,
      address: address.trim() || `Lat ${point.lat.toFixed(4)}, Lng ${point.lng.toFixed(4)}`,
      imageDataUrl,
      reportedBy: user?.id ?? "anon",
      reportedByName: user?.name ?? "Anonymous",
    });

    toast.success("Incident Reported", {
      description: "Your report has been submitted for review. Thank you!"
    });
    
    setSubmitting(false);
    navigate("/dashboard");
  };

  const types: { value: IncidentType; label: string; icon: any }[] = [
    { value: "accident", label: "Accident", icon: AlertTriangle },
    { value: "jam", label: "Traffic Jam", icon: Car },
    { value: "roadblock", label: "Road Block", icon: Construction },
  ];

  return (
    <div className="p-4 md:p-6 grid lg:grid-cols-5 gap-4 max-w-[1600px] mx-auto animate-fade-in-up">
      <Card className="lg:col-span-2 p-5 bg-card/60 border-border space-y-5 h-fit shadow-card">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Report an incident
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Help your city respond faster by providing accurate details.</p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Incident type</Label>
          <ToggleGroup
            type="single" value={type}
            onValueChange={(v) => v && setType(v as IncidentType)}
            className="grid grid-cols-3 gap-2"
          >
            {types.map((t) => (
              <ToggleGroupItem
                key={t.value}
                value={t.value}
                className="flex flex-col gap-1.5 h-auto py-3.5 border border-border data-[state=on]:bg-primary/15 data-[state=on]:border-primary data-[state=on]:text-primary transition-all duration-300"
              >
                <t.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{t.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Location Selection</Label>
          <div className={`flex items-center gap-3 rounded-lg border p-3 bg-surface-2/40 transition-colors ${point ? "border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.1)]" : "border-border"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${point ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              {point ? (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-primary">Location Picked</span>
                  <span className="text-[10px] font-mono opacity-70">
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">No location selected</span>
                  <span className="text-[10px] opacity-60 italic">Tap on the map to set location</span>
                </div>
              )}
            </div>
            {point && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setPoint(null)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addr" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Address / Landmark (optional)</Label>
          <Input id="addr" value={address} maxLength={200} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Near India Gate, Block A" className="bg-surface-2/40 border-border focus:border-primary/50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Detailed Description</Label>
          <Textarea
            id="desc" rows={4} maxLength={500}
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what happened, severity, lanes affected..."
            className="bg-surface-2/40 border-border focus:border-primary/50 resize-none"
          />
          <div className="flex justify-between items-center px-1">
             <p className="text-[10px] text-muted-foreground italic">Minimum 8 characters required</p>
             <p className={`text-[10px] font-medium ${description.length >= 500 ? "text-destructive" : "text-muted-foreground"}`}>{description.length}/500</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Evidence Photo (optional)</Label>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          {imageDataUrl ? (
            <div className="relative group">
              <img src={imageDataUrl} alt="Incident preview" className="w-full max-h-48 object-cover rounded-lg border border-border shadow-sm group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                 <Button variant="secondary" size="sm" onClick={() => setImageDataUrl(undefined)} className="gap-2">
                    <X className="h-4 w-4" /> Remove Photo
                 </Button>
              </div>
            </div>
          ) : (
            <button
              type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-8 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-2 group"
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImagePlus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Attach an image (max 4 MB)</span>
            </button>
          )}
        </div>

        <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12 text-base font-semibold transition-all hover:scale-[1.01]">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Report...
            </>
          ) : (
            "Submit Incident Report"
          )}
        </Button>
      </Card>

      <Card className="lg:col-span-3 p-2 bg-card/60 border-border overflow-hidden shadow-card flex flex-col">
        <div className="px-3 py-2 border-b border-border flex items-center justify-between">
           <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Incident Location</span>
           <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">Precise coordinates required</Badge>
        </div>
        <div className="flex-1 min-h-[500px] lg:h-full relative">
          <TrafficMap
            onMapClick={(lat, lng) => setPoint({ lat, lng })}
            pickedPoint={point}
            className="h-full"
          />
          {!point && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
               <div className="bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                  Click on the map to mark the location
               </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
