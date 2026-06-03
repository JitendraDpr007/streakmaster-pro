import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface UserState {
  onboarded: boolean;
  name: string;
  target: string;
  level: string;
  goalCompanies: string[];
  dailyGoal: number;
  xp: number;
  streak: number;
  longestStreak: number;
  solved: string[]; // question ids
  solvedHistory: { date: string; count: number }[];
  achievements: string[];
}

const DEFAULT: UserState = {
  onboarded: false,
  name: "Rachit",
  target: "FAANG / Top Tier",
  level: "Mid Level",
  goalCompanies: ["Google", "Uber", "Razorpay"],
  dailyGoal: 3,
  xp: 1240,
  streak: 7,
  longestStreak: 12,
  solved: [],
  solvedHistory: seedHistory(),
  achievements: ["warrior"],
};

function seedHistory() {
  const out: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const r = Math.random();
    const count = r < 0.35 ? 0 : r < 0.7 ? 1 : r < 0.9 ? 2 : 3;
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}

const KEY = "skillstreak.user.v1";

interface Ctx {
  user: UserState;
  setUser: (u: UserState) => void;
  patch: (p: Partial<UserState>) => void;
  recordSolve: (questionId: string, xp: number) => void;
}

const UserCtx = createContext<Ctx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(user));
  }, [user, ready]);

  const patch = (p: Partial<UserState>) => setUser((u) => ({ ...u, ...p }));

  const recordSolve = (questionId: string, xp: number) => {
    setUser((u) => {
      if (u.solved.includes(questionId)) return u;
      const today = new Date().toISOString().slice(0, 10);
      const hist = [...u.solvedHistory];
      const todayEntry = hist[hist.length - 1];
      if (todayEntry?.date === today) {
        hist[hist.length - 1] = { date: today, count: todayEntry.count + 1 };
      } else {
        hist.push({ date: today, count: 1 });
      }
      return {
        ...u,
        xp: u.xp + xp,
        solved: [...u.solved, questionId],
        solvedHistory: hist,
      };
    });
  };

  return (
    <UserCtx.Provider value={{ user, setUser, patch, recordSolve }}>{children}</UserCtx.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser outside provider");
  return ctx;
}
