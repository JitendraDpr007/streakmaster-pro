import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviewResume } from "@/lib/skillstreak/resume.functions";
import { COMPANIES } from "@/lib/skillstreak/data";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "AI Resume Reviewer · SkillStreak" },
      {
        name: "description",
        content: "Paste your resume. Get a brutally honest ATS score and STAR-style rewrites from AI.",
      },
    ],
  }),
  component: ResumePage,
});

interface Review {
  atsScore: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  rewrites: { before: string; after: string }[];
  missingKeywords: string[];
  nextSteps: string[];
}

function ResumePage() {
  const navigate = useNavigate();
  const review = useServerFn(reviewResume);
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Review | null>(null);

  const onReview = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await review({
        data: {
          resume: resume.trim(),
          targetRole: role || undefined,
          targetCompany: company || undefined,
        },
      });
      if (res.ok) setResult(res.review as Review);
      else setError(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pb-24 pt-5">
      <button
        onClick={() => navigate({ to: "/profile" })}
        className="mb-3 text-[11px] text-muted-foreground active:scale-95"
      >
        ← Back
      </button>
      <div className="text-[10px] uppercase tracking-[0.2em] text-lime">AI · Powered</div>
      <h1 className="font-syne text-2xl">Resume Reviewer</h1>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Paste your resume. Get an ATS score, STAR rewrites, missing keywords — in 10 seconds.
      </p>

      {!result && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Target role (SDE-2)"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-lime"
            />
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-lime"
            >
              <option value="">Target company</option>
              {COMPANIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={14}
            placeholder="Paste your full resume here (plain text)…"
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-[13px] leading-relaxed outline-none focus:border-lime"
          />
          <p className="text-right font-mono text-[10px] text-muted-foreground">
            {resume.length.toLocaleString()} chars · min 50
          </p>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={onReview}
            disabled={loading || resume.trim().length < 50}
            className="w-full rounded-2xl bg-lime py-4 text-sm font-bold text-primary-foreground transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Reviewing… (~10s)" : "Review my resume →"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <ScoreCard score={result.atsScore} verdict={result.verdict} />

            <Section title="✅ Strengths" tone="lime" items={result.strengths} />
            <Section title="⚠️ Weaknesses" tone="orange" items={result.weaknesses} />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                ✏️ Bullet Rewrites
              </p>
              <div className="mt-2 space-y-3">
                {result.rewrites.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-card p-3">
                    <div className="text-[10px] uppercase tracking-wider text-red-400">Before</div>
                    <p className="mt-1 text-[12px] text-foreground/70 line-through decoration-red-500/30">
                      {r.before}
                    </p>
                    <div className="mt-3 text-[10px] uppercase tracking-wider text-lime">After</div>
                    <p className="mt-1 text-[12px] text-foreground">{r.after}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                🔑 Missing ATS Keywords
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.missingKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-cyan"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <Section title="🚀 Next Steps" tone="lime" items={result.nextSteps} numbered />

            <button
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className="w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-muted-foreground"
            >
              Review another version
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ score, verdict }: { score: number; verdict: string }) {
  const color = score >= 75 ? "text-lime" : score >= 60 ? "text-yellow-400" : "text-red-400";
  const ring = score >= 75 ? "stroke-lime" : score >= 60 ? "stroke-yellow-400" : "stroke-red-400";
  const circ = 2 * Math.PI * 44;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" className="stroke-white/10" />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={ring}
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className={`absolute inset-0 grid place-items-center font-mono text-2xl font-bold ${color}`}>
            {score}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ATS Score</div>
          <p className="mt-1 text-sm font-semibold leading-snug">{verdict}</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  tone,
  numbered,
}: {
  title: string;
  items: string[];
  tone: "lime" | "orange";
  numbered?: boolean;
}) {
  const bullet = tone === "lime" ? "text-lime" : "text-orange-400";
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-snug">
            <span className={`${bullet} font-mono shrink-0`}>{numbered ? `${i + 1}.` : "→"}</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
