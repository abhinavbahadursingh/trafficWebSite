import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTraffic } from "@/stores/trafficStore";
import { Radio, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { SignalPhase } from "@/types/traffic";

const PhaseDot = ({ active, color }: { active: boolean; color: string }) => (
  <div className="relative h-9 w-9 flex items-center justify-center">
    <div
      className="h-7 w-7 rounded-full transition-all"
      style={{
        background: active ? color : "hsl(var(--muted))",
        boxShadow: active ? `0 0 18px ${color}` : "none",
        opacity: active ? 1 : 0.4,
      }}
    />
  </div>
);

export default function SignalControl() {
  const signals = useTraffic((s) => s.signals);
  const setSignalDurations = useTraffic((s) => s.setSignalDurations);
  const overrideSignal = useTraffic((s) => s.overrideSignal);
  const resetSignal = useTraffic((s) => s.resetSignal);

  const handleOverride = (id: string, phase: SignalPhase | null, name: string) => {
    overrideSignal(id, phase);
    toast.success(phase ? `${name} forced to ${phase.toUpperCase()}` : `${name} restored to auto`);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1400px] mx-auto">
      <div>
        <h2 className="font-display text-2xl font-semibold">Signal control center</h2>
        <p className="text-sm text-muted-foreground">Tune phase durations or override signals in emergencies.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {signals.map((sig) => {
          const phaseColor = sig.phase === "green" ? "hsl(var(--success))" : sig.phase === "yellow" ? "hsl(var(--warning))" : "hsl(var(--destructive))";
          return (
            <Card key={sig.id} className="p-5 bg-card/60 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary" />
                    <p className="font-display font-semibold">{sig.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {sig.lat.toFixed(4)}, {sig.lng.toFixed(4)}
                  </p>
                </div>
                {sig.manualOverride && (
                  <Badge variant="outline" className="border-warning/40 text-warning">Manual override</Badge>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-1 p-2 rounded-xl bg-surface-2">
                  <PhaseDot active={sig.phase === "red"} color="hsl(var(--destructive))" />
                  <PhaseDot active={sig.phase === "yellow"} color="hsl(var(--warning))" />
                  <PhaseDot active={sig.phase === "green"} color="hsl(var(--success))" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Current phase</p>
                  <p className="font-display text-2xl font-semibold capitalize" style={{ color: phaseColor }}>
                    {sig.phase} <span className="text-sm font-mono text-muted-foreground">• {sig.remaining}s</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {(["red", "yellow", "green"] as SignalPhase[]).map((p) => (
                  <div key={p}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="capitalize">{p} duration</span>
                      <span className="font-mono text-muted-foreground">{sig.durations[p]}s</span>
                    </div>
                    <Slider
                      min={p === "yellow" ? 2 : 10}
                      max={p === "yellow" ? 10 : 90}
                      step={1}
                      value={[sig.durations[p]]}
                      onValueChange={([v]) => setSignalDurations(sig.id, { ...sig.durations, [p]: v })}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => handleOverride(sig.id, "red", sig.name)}>Force red</Button>
                <Button size="sm" variant="outline" className="border-warning/40 text-warning hover:bg-warning/10"
                  onClick={() => handleOverride(sig.id, "yellow", sig.name)}>Force yellow</Button>
                <Button size="sm" variant="outline" className="border-success/40 text-success hover:bg-success/10"
                  onClick={() => handleOverride(sig.id, "green", sig.name)}>Force green</Button>
                <Button size="sm" variant="ghost" onClick={() => { resetSignal(sig.id); toast.success(`${sig.name} reset`); }}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                </Button>
                {sig.manualOverride && (
                  <Button size="sm" className="ml-auto bg-gradient-primary text-primary-foreground hover:opacity-90"
                    onClick={() => handleOverride(sig.id, null, sig.name)}>Restore auto</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
