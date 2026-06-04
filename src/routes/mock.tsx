import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestions } from "@/lib/skillstreak/questions";
import { COMPANIES } from "@/lib/skillstreak/data";
import { useUser } from "@/lib/skillstreak/store";

export const Route = createFileRoute("/mock")({
  head: () => ({
    meta: [{ title: "Mock Interview · SkillStreak" }],
  }),
  component: MockPage,
});

const DURATION = 45 * 60; // 45 min in seconds
const Q_COUNT = 5;

type Stage = "setup" | "active" | "done";

function MockPage() {
  const navigate = useNavigate();
  const { data: all = [] } = useQuestions();
  const { addXP } = useUser();
  const [stage, setStage] = useState<Stage>("setup");
  const [company, setCompany] = useState<string>("Google");
  const [picked, setPicked] = useState<typeof all>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);

  // Timer
  useEffect(() => {
    if (stage !== "active") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setStage("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  const start = () => {
    if (all.length === 0) return;
    const pool = all.filter((q) => q.companies.includes(company));
    const source = pool.length >= Q_COUNT ? pool : all;
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, Q_COUNT);
    setPicked(shuffled);
    setAnswers(Array(shuffled.length).fill(null));
    setIdx(0);
    setTimeLeft(DURATION);
    setStage("active");
  };

  const submit = (selected: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = selected;
      return next;
    });
    if (idx + 1 >= picked.length) {
      setStage("done");
    } else {
      setIdx((i) => i + 1);
    }
  };

  const score = useMemo(() => {
    let correct = 0;
    let xp = 0;
    picked.forEach((q, i) => {
      if (answers[i] === q.correctIndex) {
        correct++;
        xp += q.xp;
      }
    });
    return { correct, total: picked.length, xp };
  }, [picked, answers]);

  // Award XP once when done
  useEffect(() => {
    if (stage === "done" && score.xp > 0) {
      addXP(score.xp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (stage === "setup") {
    return (
      <div className="px-5 pb-24 pt-5">
        <button
          onClick={() => navigate({ to: "/" })}
          className="mb-3 text-[11px] text-muted-foreground active:scale-95"
        >
          ← Home
        </button>
        <div className="text-[10px] uppercase tracking-[0.2em] text-lime">⏱ Timed · Real Interview</div>
        <h1 className="font-syne text-2xl">Mock Interview</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {Q_COUNT} questions · 45 minutes · no second chances. Just like the real thing.
        </p>

        <div className="mt-5 space-y-3">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Pick target company
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COMPANIES.slice(0, 8).map((c) => (
                <button
                  key={c}
                  onClick={() => setCompany(c)}
                  className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition ${
                    company === c
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-white/10 bg-card text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 text-[12px] leading-relaxed">
            <p className="font-bold">Rules</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>→ Timer starts the moment you tap Begin.</li>
              <li>→ No going back. Each answer is final.</li>
              <li>→ You earn XP only for correct answers.</li>
              <li>→ Closing this tab forfeits the run.</li>
            </ul>
          </div>

          <button
            onClick={start}
            disabled={all.length === 0}
            className="w-full rounded-2xl bg-lime py-4 text-sm font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-50"
          >
            Begin {company} mock →
          </button>
        </div>
      </div>
    );
  }

  if (stage === "active") {
    const q = picked[idx];
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const lowTime = timeLeft < 5 * 60;

    return (
      <div className="px-5 pb-24 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Q {idx + 1} of {picked.length}
            </div>
            <div className="mt-0.5 text-[11px] text-lime">{company} · mock</div>
          </div>
          <div
            className={`rounded-xl border px-3 py-1.5 font-mono text-base font-bold ${
              lowTime
                ? "border-red-500/40 bg-red-500/10 text-red-400 animate-pulse"
                : "border-lime/30 bg-lime/5 text-lime"
            }`}
          >
            {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
          </div>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-lime transition-all"
            style={{ width: `${((idx + 1) / picked.length) * 100}%` }}
          />
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <div className="text-[10px] uppercase tracking-widest text-cyan">{q.subcategory}</div>
          <h2 className="mt-1 font-syne text-xl leading-tight">{q.title}</h2>
          <p className="mt-3 rounded-2xl border border-white/10 bg-card p-3 text-[12px] leading-relaxed text-foreground/80">
            {q.story}
          </p>
          <p className="mt-3 text-[13px] font-semibold">{q.question}</p>

          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => submit(i)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-left text-[13px] transition hover:border-lime/40 active:scale-[0.98]"
              >
                <span className="mr-2 font-mono text-[11px] text-muted-foreground">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // done
  const pct = picked.length ? Math.round((score.correct / picked.length) * 100) : 0;
  const grade = pct >= 80 ? "🏆 Hireable" : pct >= 60 ? "📈 Promising" : pct >= 40 ? "🛠 Needs Work" : "💀 Brutal";

  return (
    <div className="px-5 pb-24 pt-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-lime">Mock complete</div>
      <h1 className="font-syne text-2xl">{grade}</h1>
      <p className="mt-1 text-[12px] text-muted-foreground">
        {company} mock · {picked.length - score.correct} mistakes
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Stat label="Score" value={`${score.correct}/${picked.length}`} />
        <Stat label="Accuracy" value={`${pct}%`} />
        <Stat label="XP" value={`+${score.xp}`} highlight />
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Review</p>
        <div className="mt-2 space-y-2">
          {picked.map((q, i) => {
            const correct = answers[i] === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-3 ${
                  correct ? "border-lime/30 bg-lime/5" : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`text-sm ${correct ? "text-lime" : "text-red-400"}`}>
                    {correct ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold">{q.title}</div>
                    {!correct && (
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Correct: <span className="text-lime">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setStage("setup")}
        className="mt-6 w-full rounded-2xl bg-lime py-4 text-sm font-bold text-primary-foreground active:scale-[0.98]"
      >
        Run another mock →
      </button>
      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-2 w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-muted-foreground"
      >
        Back home
      </button>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-3 text-center">
      <div className={`font-mono text-lg font-bold ${highlight ? "text-lime" : "text-foreground"}`}>
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
