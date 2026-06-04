import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

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
  solved: string[];
  solvedHistory: { date: string; count: number }[];
  achievements: string[];
}

const DEFAULT: UserState = {
  onboarded: false,
  name: "Coder",
  target: "FAANG / Top Tier",
  level: "Mid Level",
  goalCompanies: ["Google", "Uber", "Razorpay"],
  dailyGoal: 3,
  xp: 0,
  streak: 0,
  longestStreak: 0,
  solved: [],
  solvedHistory: [],
  achievements: [],
};

interface Ctx {
  user: UserState;
  setUser: (u: UserState) => void;
  patch: (p: Partial<UserState>) => Promise<void>;
  recordSolve: (questionId: string, xp: number, selectedIndex?: number) => Promise<void>;
  ready: boolean;
  streakMilestone: number | null;
  clearStreakMilestone: () => void;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];
function nextMilestoneHit(prev: number, next: number): number | null {
  for (const m of STREAK_MILESTONES) {
    if (prev < m && next >= m) return m;
  }
  return null;
}

const UserCtx = createContext<Ctx | null>(null);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function bucketHistory(rows: { created_at: string }[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const d = r.created_at.slice(0, 10);
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  const out: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({ date: iso, count: map.get(iso) ?? 0 });
  }
  return out;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserState>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setUser(DEFAULT);
      setReady(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [{ data: profile }, { data: subs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
        supabase
          .from("submissions")
          .select("question_id, correct, created_at")
          .eq("user_id", authUser.id)
          .eq("correct", true)
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      const solvedIds = Array.from(new Set((subs ?? []).map((s) => s.question_id)));
      setUser({
        onboarded: profile?.onboarded ?? false,
        name: profile?.name ?? "Coder",
        target: profile?.target ?? "FAANG / Top Tier",
        level: profile?.experience_level ?? "Mid Level",
        goalCompanies: profile?.goal_companies ?? ["Google", "Uber", "Razorpay"],
        dailyGoal: profile?.daily_goal ?? 3,
        xp: profile?.xp ?? 0,
        streak: profile?.streak ?? 0,
        longestStreak: profile?.longest_streak ?? 0,
        solved: solvedIds,
        solvedHistory: bucketHistory(subs ?? []),
        achievements: profile?.achievements ?? [],
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const patch = async (p: Partial<UserState>) => {
    setUser((u) => ({ ...u, ...p }));
    if (!authUser) return;
    const dbPatch: Record<string, unknown> = {};
    if (p.name !== undefined) dbPatch.name = p.name;
    if (p.target !== undefined) dbPatch.target = p.target;
    if (p.level !== undefined) dbPatch.experience_level = p.level;
    if (p.goalCompanies !== undefined) dbPatch.goal_companies = p.goalCompanies;
    if (p.dailyGoal !== undefined) dbPatch.daily_goal = p.dailyGoal;
    if (p.xp !== undefined) dbPatch.xp = p.xp;
    if (p.streak !== undefined) dbPatch.streak = p.streak;
    if (p.longestStreak !== undefined) dbPatch.longest_streak = p.longestStreak;
    if (p.achievements !== undefined) dbPatch.achievements = p.achievements;
    if (p.onboarded !== undefined) dbPatch.onboarded = p.onboarded;
    if (Object.keys(dbPatch).length === 0) return;
    await supabase.from("profiles").update(dbPatch as never).eq("id", authUser.id);
  };

  const recordSolve = async (questionId: string, xp: number, selectedIndex?: number) => {
    if (!authUser) return;
    if (user.solved.includes(questionId)) return;

    // streak math
    const today = todayISO();
    const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
    let nextStreak = user.streak;
    let lastActive: string | undefined;
    // fetch last_active_date
    const { data: prof } = await supabase
      .from("profiles")
      .select("last_active_date")
      .eq("id", authUser.id)
      .maybeSingle();
    lastActive = prof?.last_active_date ?? undefined;
    if (lastActive !== today) {
      nextStreak = lastActive === yesterday ? user.streak + 1 : 1;
    }
    const longest = Math.max(user.longestStreak, nextStreak);
    const newXp = user.xp + xp;

    setUser((u) => {
      const hist = [...u.solvedHistory];
      const todayEntry = hist[hist.length - 1];
      if (todayEntry?.date === today) {
        hist[hist.length - 1] = { date: today, count: todayEntry.count + 1 };
      } else {
        hist.push({ date: today, count: 1 });
      }
      return {
        ...u,
        xp: newXp,
        streak: nextStreak,
        longestStreak: longest,
        solved: [...u.solved, questionId],
        solvedHistory: hist,
      };
    });

    await Promise.all([
      supabase.from("submissions").insert({
        user_id: authUser.id,
        question_id: questionId,
        correct: true,
        selected_index: selectedIndex ?? null,
        xp_awarded: xp,
      }),
      supabase
        .from("profiles")
        .update({
          xp: newXp,
          streak: nextStreak,
          longest_streak: longest,
          last_active_date: today,
        })
        .eq("id", authUser.id),
    ]);
  };

  return (
    <UserCtx.Provider value={{ user, setUser, patch, recordSolve, ready }}>
      {children}
    </UserCtx.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser outside provider");
  return ctx;
}
