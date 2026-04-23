import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/types/traffic";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
  role: z.enum(["admin", "police", "public"]),
});

export default function Signup() {
  const { user, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("public");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, password, role });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = signup(parsed.data as { name: string; email: string; password: string; role: UserRole });
    setLoading(false);
    if (!res.ok) { toast.error(res.error || "Signup failed"); return; }
    toast.success("Account created");
    navigate("/dashboard");
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
            <p className="font-display font-semibold leading-tight">Create account</p>
            <p className="text-xs text-muted-foreground">Join the city ops platform</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@city.gov" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public user</SelectItem>
                <SelectItem value="police">Traffic police</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Demo build — choose any role to explore.</p>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
