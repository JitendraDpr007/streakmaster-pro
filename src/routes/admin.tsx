import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/skillstreak/auth";
import { useQuestions } from "@/lib/skillstreak/questions";
import {
  CATEGORY_ICON,
  COMPANIES,
  type Category,
  type Difficulty,
  type Question,
} from "@/lib/skillstreak/data";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "questions" | "users";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="glass w-full rounded-2xl p-6 text-center">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Restricted
          </div>
          <h1 className="font-syne text-2xl">Admins only</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Signed in as {user?.email ?? "—"}. This area is for the SkillStreak team.
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-5 w-full rounded-xl bg-lime px-4 py-3 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-lime">
            SkillStreak · Admin
          </div>
          <h1 className="font-syne text-2xl">Control Panel</h1>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-muted-foreground active:scale-95"
        >
          Exit
        </button>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto">
        {(["dashboard", "questions", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-xs capitalize transition ${
              tab === t
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/10 text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "dashboard" && <Dashboard />}
        {tab === "questions" && <QuestionManager />}
        {tab === "users" && <UserManager />}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl text-lime">{value}</div>
      {sub && <div className="mt-0.5 text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalAll: 0,
    totalWeek: 0,
    totalToday: 0,
    solvedToday: 0,
    streak7Plus: 0,
    dau: 0,
  });

  useEffect(() => {
    (async () => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
      const dayAgo = new Date(Date.now() - 86400_000).toISOString();

      const [{ count: totalAll }, { count: totalWeek }, { count: totalToday }, { count: solvedToday }, { count: streak7Plus }, { count: dau }] =
        await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
          supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", `${today}T00:00:00`),
          supabase.from("submissions").select("id", { count: "exact", head: true }).gte("created_at", `${today}T00:00:00`).eq("correct", true),
          supabase.from("profiles").select("id", { count: "exact", head: true }).gte("streak", 7),
          supabase.from("profiles").select("id", { count: "exact", head: true }).gte("last_active_date", dayAgo.slice(0, 10)),
        ]);
      setStats({
        totalAll: totalAll ?? 0,
        totalWeek: totalWeek ?? 0,
        totalToday: totalToday ?? 0,
        solvedToday: solvedToday ?? 0,
        streak7Plus: streak7Plus ?? 0,
        dau: dau ?? 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Users Today" value={stats.totalToday.toLocaleString()} />
        <StatCard label="Users This Week" value={stats.totalWeek.toLocaleString()} />
        <StatCard label="All Time Users" value={stats.totalAll.toLocaleString()} />
        <StatCard label="DAU" value={stats.dau.toLocaleString()} sub="last 24h" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Solved Today" value={stats.solvedToday.toLocaleString()} />
        <StatCard label="7+ Day Streaks" value={stats.streak7Plus.toLocaleString()} sub="🔥 warriors" />
      </div>
      <div className="glass rounded-2xl p-4">
        <div className="text-xs text-muted-foreground">Live data</div>
        <p className="mt-2 text-sm">
          Stats pulled in real-time from Lovable Cloud.
        </p>
      </div>
    </div>
  );
}

const CATS: Category[] = ["DSA", "SQL", "System Design", "Behavioral", "Resume Tips"];
const DIFFS: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

function QuestionManager() {
  const { data: questions = [], refetch } = useQuestions();
  const qc = useQueryClient();
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const [diff, setDiff] = useState<Difficulty | "ALL">("ALL");
  const [editing, setEditing] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (cat === "ALL" || q.category === cat) &&
          (diff === "ALL" || q.difficulty === diff),
      ),
    [questions, cat, diff],
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from("questions").delete().eq("id", id);
    await qc.invalidateQueries({ queryKey: ["questions"] });
    refetch();
  };

  const handleSave = async (q: Question) => {
    const payload = {
      type: q.type,
      category: q.category,
      subcategory: q.subcategory,
      title: q.title,
      difficulty: q.difficulty,
      xp: q.xp,
      companies: q.companies,
      icon: q.icon,
      story: q.story,
      question: q.question,
      options: q.options,
      correct_index: q.correctIndex,
      explanation: q.explanation,
      why_others_wrong: q.whyOthersWrong,
      complexity: q.complexity ?? null,
      interview_tip: q.interviewTip,
      followup: q.followup,
      similar_questions: q.similar ?? null,
      problem_statement: q.problemStatement ?? null,
      leetcode_url: q.leetcodeUrl ?? null,
      gfg_url: q.gfgUrl ?? null,
      sql_schema: q.sqlSchema ?? null,
      sql_seed: q.sqlSeed ?? null,
      sql_expected: q.sqlExpected ?? null,
      requirements: q.requirements ?? null,
      hld: q.hld ?? null,
      lld: q.lld ?? null,
      tradeoffs: q.tradeoffs ?? null,
      is_published: true,
    };
    if (questions.some((x) => x.id === q.id)) {
      await supabase.from("questions").update(payload as never).eq("id", q.id);
    } else {
      await supabase.from("questions").insert(payload as never);
    }
    setShowForm(false);
    setEditing(null);
    await qc.invalidateQueries({ queryKey: ["questions"] });
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "ALL")}
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs"
        >
          <option value="ALL">All categories</option>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={diff}
          onChange={(e) => setDiff(e.target.value as Difficulty | "ALL")}
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs"
        >
          <option value="ALL">All difficulty</option>
          {DIFFS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="ml-auto rounded-lg bg-lime px-3 py-1.5 text-xs font-bold text-primary-foreground active:scale-95"
        >
          + Add Question
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((q) => (
          <div key={q.id} className="glass rounded-xl p-3">
            <div className="flex items-start gap-2">
              <div className="text-lg">{CATEGORY_ICON[q.category]}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{q.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{q.category}</span>
                  <span>·</span>
                  <span
                    className={
                      q.difficulty === "EASY"
                        ? "text-green-400"
                        : q.difficulty === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {q.difficulty}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-lime">+{q.xp} XP</span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setEditing(q);
                  setShowForm(true);
                }}
                className="flex-1 rounded-lg border border-white/10 py-1.5 text-[11px]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="flex-1 rounded-lg border border-red-500/30 py-1.5 text-[11px] text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No questions match your filters.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <QuestionForm
            initial={editing}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Question | null;
  onClose: () => void;
  onSave: (q: Question) => void;
}) {
  const [q, setQ] = useState<Question>(
    initial ?? {
      id: "",
      type: "mcq",
      category: "DSA",
      subcategory: "",
      title: "",
      difficulty: "EASY",
      xp: 20,
      companies: [],
      icon: "🧠",
      story: "",
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
      whyOthersWrong: "",
      interviewTip: "",
      followup: "",
    },
  );

  const set = <K extends keyof Question>(k: K, v: Question[K]) =>
    setQ((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0E0E14] p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-syne text-lg">{initial ? "Edit" : "New"} Question</h2>
          <button onClick={onClose} className="text-muted-foreground">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Field label="Title">
            <input value={q.title} onChange={(e) => set("title", e.target.value)} className="input" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={q.category} onChange={(e) => set("category", e.target.value as Category)} className="input">
                {CATS.map((c) => (<option key={c}>{c}</option>))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={q.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)} className="input">
                {DIFFS.map((d) => (<option key={d}>{d}</option>))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Subcategory">
              <input value={q.subcategory} onChange={(e) => set("subcategory", e.target.value)} className="input" />
            </Field>
            <Field label="XP Reward">
              <input type="number" value={q.xp} onChange={(e) => set("xp", parseInt(e.target.value || "0", 10))} className="input" />
            </Field>
          </div>

          <Field label="Companies (comma-separated)">
            <input
              value={q.companies.join(", ")}
              onChange={(e) => set("companies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder={COMPANIES.slice(0, 3).join(", ")}
              className="input"
            />
          </Field>

          <Field label="Real World Story">
            <textarea value={q.story} onChange={(e) => set("story", e.target.value)} rows={3} className="input" />
          </Field>

          <Field label="Question">
            <textarea value={q.question} onChange={(e) => set("question", e.target.value)} rows={2} className="input" />
          </Field>

          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Options (tap radio for correct)
            </div>
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" checked={q.correctIndex === i} onChange={() => set("correctIndex", i)} className="accent-lime" />
                <input
                  value={opt}
                  onChange={(e) => {
                    const next = [...q.options];
                    next[i] = e.target.value;
                    set("options", next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="input flex-1"
                />
              </div>
            ))}
          </div>

          <Field label="Explanation">
            <textarea value={q.explanation} onChange={(e) => set("explanation", e.target.value)} rows={3} className="input" />
          </Field>

          <Field label="Why others are wrong">
            <textarea value={q.whyOthersWrong} onChange={(e) => set("whyOthersWrong", e.target.value)} rows={2} className="input" />
          </Field>

          <Field label="Interview Tip">
            <textarea value={q.interviewTip} onChange={(e) => set("interviewTip", e.target.value)} rows={2} className="input" />
          </Field>

          <Field label="Follow-up">
            <input value={q.followup} onChange={(e) => set("followup", e.target.value)} className="input" />
          </Field>

          <Field label="Complexity (optional)">
            <input value={q.complexity ?? ""} onChange={(e) => set("complexity", e.target.value)} className="input" />
          </Field>

          <button
            onClick={() => onSave(q)}
            className="mt-2 w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Save Question
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function UserManager() {
  const [users, setUsers] = useState<Array<{ id: string; email: string | null; name: string; xp: number; streak: number; last_active_date: string | null }>>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,email,name,xp,streak,last_active_date")
        .order("xp", { ascending: false })
        .limit(200);
      setUsers(data ?? []);
    })();
  }, []);

  const filtered = users.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or email"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-lime"
      />
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className="glass flex items-center gap-3 rounded-xl p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-lime/10 text-sm font-bold text-lime">
              {u.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{u.name}</div>
              <div className="truncate text-[10px] text-muted-foreground">{u.email}</div>
            </div>
            <div className="text-right text-[10px]">
              <div className="font-mono text-lime">⚡ {u.xp}</div>
              <div className="text-muted-foreground">🔥 {u.streak} · {u.last_active_date ?? "—"}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">No users found.</div>
        )}
      </div>
    </div>
  );
}
