import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
});

const demoAccounts = [
  { label: "Admin", email: "admin@city.gov", password: "admin123" },
  { label: "Police", email: "police@city.gov", password: "police123" },
  { label: "Public", email: "user@city.gov", password: "user1234" },
];

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = login(parsed.data.email, parsed.data.password);
    setLoading(false);
    if (!res.ok) { toast.error(res.error || "Login failed"); return; }
    toast.success("Welcome back");
    navigate(location.state?.from || "/dashboard");
  };

  const fillDemo = (a: { email: string; password: string }) => {
    setEmail(a.email); setPassword(a.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-glow pointer-events-none" />
      <Card className="w-full max-w-md p-8 relative z-10 bg-card/80 backdrop-blur border-border">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold leading-tight">Smart Traffic</p>
            <p className="text-xs text-muted-foreground">Sign in to your control center</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@city.gov" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Try a demo role</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((a) => (
              <button key={a.label} type="button" onClick={() => fillDemo(a)}
                className="text-xs py-2 rounded-md border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors">
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-6">
          New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
