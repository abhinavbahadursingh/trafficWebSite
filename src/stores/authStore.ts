import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types/traffic";

interface AuthState {
  user: User | null;
  token: string | null;
  users: User[]; // mock "DB"
  passwords: Record<string, string>; // email -> password (mock)
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (input: { name: string; email: string; password: string; role: UserRole }) => { ok: boolean; error?: string };
  logout: () => void;
}

const seedUsers: User[] = [
  { id: "u-admin", name: "City Admin", email: "admin@city.gov", role: "admin", createdAt: new Date().toISOString() },
  { id: "u-police", name: "Officer Reyes", email: "police@city.gov", role: "police", createdAt: new Date().toISOString() },
  { id: "u-public", name: "Alex Rivera", email: "user@city.gov", role: "public", createdAt: new Date().toISOString() },
];

const seedPasswords: Record<string, string> = {
  "admin@city.gov": "admin123",
  "police@city.gov": "police123",
  "user@city.gov": "user1234",
};

const fakeJwt = (userId: string) =>
  btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }));

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: seedUsers,
      passwords: seedPasswords,
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const u = get().users.find((x) => x.email.toLowerCase() === e);
        if (!u) return { ok: false, error: "No account with that email." };
        if (get().passwords[u.email] !== password) return { ok: false, error: "Incorrect password." };
        set({ user: u, token: fakeJwt(u.id) });
        return { ok: true };
      },
      signup: ({ name, email, password, role }) => {
        const e = email.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === e)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const u: User = {
          id: "u-" + Math.random().toString(36).slice(2, 9),
          name: name.trim(),
          email: e,
          role,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          users: [...s.users, u],
          passwords: { ...s.passwords, [e]: password },
          user: u,
          token: fakeJwt(u.id),
        }));
        return { ok: true };
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: "stms-auth" }
  )
);
