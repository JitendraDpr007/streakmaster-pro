import { QUESTIONS, type Question, type Difficulty, type Category, LEADERBOARD } from "./data";

export const ADMIN_EMAIL = "rachitmisra0398@gmail.com";
const EMAIL_KEY = "skillstreak.admin.email";
const QUESTIONS_KEY = "skillstreak.admin.questions.v1";
const SOLVE_COUNTS_KEY = "skillstreak.admin.solveCounts.v1";

export function getAdminEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}
export function setAdminEmail(email: string) {
  localStorage.setItem(EMAIL_KEY, email);
}
export function clearAdminEmail() {
  localStorage.removeItem(EMAIL_KEY);
}
export function isAdmin(): boolean {
  return getAdminEmail()?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function loadQuestions(): Question[] {
  if (typeof window === "undefined") return QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return QUESTIONS;
}
export function saveQuestions(qs: Question[]) {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(qs));
}

export function getSolveCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SOLVE_COUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed with stable pseudo counts
  const seed: Record<string, number> = {};
  QUESTIONS.forEach((q, i) => (seed[q.id] = 1200 + i * 437));
  return seed;
}

export interface AdminUser {
  name: string;
  email: string;
  xp: number;
  streak: number;
  lastActive: string;
  college?: string;
}

export function loadUsers(): AdminUser[] {
  const today = new Date();
  const fmt = (d: number) => {
    const x = new Date(today);
    x.setDate(today.getDate() - d);
    return x.toISOString().slice(0, 10);
  };
  return LEADERBOARD.map((u, i) => ({
    name: u.name,
    email: u.name.toLowerCase().replace(/[^a-z]/g, "") + "@skillstreak.in",
    xp: u.xp,
    streak: u.streak,
    college: u.college,
    lastActive: fmt(i % 5),
  }));
}

export function adminStats() {
  const users = loadUsers();
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalAll: 12480,
    totalWeek: 1820,
    totalToday: 312,
    dau: users.filter((u) => u.lastActive === today).length + 184,
    solvedToday: 1947,
    streak7Plus: users.filter((u) => u.streak >= 7).length + 92,
  };
}

export type { Question, Difficulty, Category };
