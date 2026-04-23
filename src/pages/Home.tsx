import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Map, AlertTriangle, BarChart3, ShieldCheck, Radio, ArrowRight } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  { icon: Map, title: "Live Traffic Map", desc: "Color-coded roads and real-time congestion across the city." },
  { icon: AlertTriangle, title: "Incident Reporting", desc: "Citizens report accidents, jams, or roadblocks with one tap." },
  { icon: ShieldCheck, title: "Admin Control", desc: "Approve reports, dispatch responses, and audit every action." },
  { icon: Radio, title: "Signal Simulation", desc: "Tune signal timing or override phases in emergencies." },
  { icon: Activity, title: "Real-time Alerts", desc: "Push notifications to nearby users when something happens." },
  { icon: BarChart3, title: "Analytics", desc: "Daily and weekly traffic trends to plan smarter cities." },
];

export default function Home() {
  const user = useAuth((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-glow pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between p-5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">Smart Traffic</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/signup"><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">Get started</Button></Link>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live city operations dashboard
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
          Traffic that <span className="text-gradient">moves</span>.<br />
          Cities that <span className="text-gradient">respond</span>.
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
          A real-time command center for monitoring congestion, coordinating incident response,
          and orchestrating traffic signals across the entire city.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12 px-7">
              Launch dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="h-12 px-7 border-primary/30 hover:bg-primary/10">
              Try demo accounts
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { v: "12,847", k: "Vehicles tracked" },
            { v: "47ms", k: "Update latency" },
            { v: "98.6%", k: "Signal uptime" },
            { v: "24/7", k: "Live monitoring" },
          ].map((s) => (
            <div key={s.k} className="p-4 rounded-xl glass border border-border">
              <p className="font-display text-2xl font-semibold text-gradient">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">Built for modern city ops</h2>
        <p className="text-muted-foreground text-center mt-3 max-w-xl mx-auto">
          From rush-hour congestion to emergency response, every tool you need in one fluid interface.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-glow animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Smart Traffic Management — Demo build with mock realtime data.
      </footer>
    </div>
  );
}
