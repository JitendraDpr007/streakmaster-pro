import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ADMIN_EMAIL,
  adminStats,
  clearAdminEmail,
  getAdminEmail,
  getSolveCounts,
  isAdmin,
  loadQuestions,
  loadUsers,
  saveQuestions,
  setAdminEmail,
  type Question,
} from "@/lib/skillstreak/admin";
import { CATEGORY_ICON, COMPANIES, type Category, type Difficulty } from "@/lib/skillstreak/data";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "questions" | "users";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    setAuthed(isAdmin());
    setEmailInput(getAdminEmail() ?? "");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setErr("Not an admin email.");
      return;
    }
    setAdminEmail(emailInput.trim());
    setAuthed(true);
    setErr("");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <form
          onSubmit={handleLogin}
          className="glass w-full rounded-2xl p-6"
        >
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Restricted
          </div>
          <h1 className="font-syne text-2xl">Admin Login</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Authorized admin email only.
          </p>
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            placeholder="you@company.com"
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-lime"
          />
          {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-lime px-4 py-3 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Enter Admin
          </button>
        </form>
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
          onClick={() => {
            clearAdminEmail();
            setAuthed(false);
          }}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-muted-foreground active:scale-95"
        >
          Sign out
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
  const s = adminStats();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Users Today" value={s.totalToday.toLocaleString()} />
        <StatCard label="Users This Week" value={s.totalWeek.toLocaleString()} />
        <StatCard label="All Time Users" value={s.totalAll.toLocaleString()} />
        <StatCard label="DAU" value={s.dau.toLocaleString()} sub="last 24h" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Solved Today" value={s.solvedToday.toLocaleString()} />
        <StatCard label="7+ Day Streaks" value={s.streak7Plus.toLocaleString()} sub="🔥 warriors" />
      </div>
      <div className="glass rounded-2xl p-4">
        <div className="text-xs text-muted-foreground">Health</div>
        <p className="mt-2 text-sm">
          All systems nominal. {s.dau} active sessions in the last 24h.
        </p>
      </div>
    </div>
  );
}

const CATS: Category[] = ["DSA", "SQL", "System Design", "Behavioral", "Resume Tips"];
const DIFFS: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const [diff, setDiff] = useState<Difficulty | "ALL">("ALL");
  const [editing, setEditing] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const counts = useMemo(() => getSolveCounts(), []);

  useEffect(() => setQuestions(loadQuestions()), []);

  const filtered = questions.filter(
    (q) =>
      (cat === "ALL" || q.category === cat) &&
      (diff === "ALL" || q.difficulty === diff),
  );

  const persist = (next: Question[]) => {
    setQuestions(next);
    saveQuestions(next);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this question?")) return;
    persist(questions.filter((q) => q.id !== id));
  };

  const handleSave = (q: Question) => {
    const exists = questions.some((x) => x.id === q.id);
    persist(exists ? questions.map((x) => (x.id === q.id ? q : x)) : [...questions, q]);
    setShowForm(false);
    setEditing(null);
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
                  <span>·</span>
                  <span>{(counts[q.id] ?? 0).toLocaleString()} solves</span>
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
      id: `q${Date.now()}`,
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
            <input
              value={q.title}
              onChange={(e) => set("title", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={q.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className="input"
              >
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select
                value={q.difficulty}
                onChange={(e) => set("difficulty", e.target.value as Difficulty)}
                className="input"
              >
                {DIFFS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Subcategory">
              <input
                value={q.subcategory}
                onChange={(e) => set("subcategory", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="XP Reward">
              <input
                type="number"
                value={q.xp}
                onChange={(e) => set("xp", parseInt(e.target.value || "0", 10))}
                className="input"
              />
            </Field>
          </div>

          <Field label="Companies (comma-separated)">
            <input
              value={q.companies.join(", ")}
              onChange={(e) =>
                set(
                  "companies",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder={COMPANIES.slice(0, 3).join(", ")}
              className="input"
            />
          </Field>

          <Field label="Real World Story">
            <textarea
              value={q.story}
              onChange={(e) => set("story", e.target.value)}
              rows={3}
              className="input"
            />
          </Field>

          <Field label="Question">
            <textarea
              value={q.question}
              onChange={(e) => set("question", e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Options (tap radio for correct)
            </div>
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={q.correctIndex === i}
                  onChange={() => set("correctIndex", i)}
                  className="accent-lime"
                />
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
            <textarea
              value={q.explanation}
              onChange={(e) => set("explanation", e.target.value)}
              rows={3}
              className="input"
            />
          </Field>

          <Field label="Why others are wrong">
            <textarea
              value={q.whyOthersWrong}
              onChange={(e) => set("whyOthersWrong", e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <Field label="Interview Tip">
            <textarea
              value={q.interviewTip}
              onChange={(e) => set("interviewTip", e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <Field label="Follow-up">
            <input
              value={q.followup}
              onChange={(e) => set("followup", e.target.value)}
              className="input"
            />
          </Field>

          <button
            onClick={() => {
              if (!q.title.trim() || !q.question.trim()) {
                alert("Title and question are required.");
                return;
              }
              onSave(q);
            }}
            className="mt-2 w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Save Question
          </button>
        </div>

        <style>{`.input{width:100%;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 12px;font-size:13px;outline:none;color:inherit}.input:focus{border-color:#CDFF47}`}</style>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

function UserManager() {
  const [users] = useState(() => loadUsers());
  const [q, setQ] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or email…"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-lime"
      />
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.email} className="glass rounded-xl p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{u.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">{u.email}</div>
                {u.college && (
                  <div className="text-[10px] text-muted-foreground">{u.college}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-lime">{u.xp.toLocaleString()} XP</div>
                <div className="text-[10px] text-muted-foreground">🔥 {u.streak}d streak</div>
                <div className="text-[10px] text-muted-foreground">Active {u.lastActive}</div>
              </div>
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
