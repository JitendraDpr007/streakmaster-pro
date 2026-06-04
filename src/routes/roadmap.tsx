import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ROADMAP } from "@/lib/skillstreak/data";
import { COMPANY_PACKS } from "@/lib/skillstreak/packs";
import { roadmapProgress } from "@/lib/skillstreak/progress";
import { useUser } from "@/lib/skillstreak/store";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Roadmap · SkillStreak" }] }),
  component: Roadmap,
});

function Roadmap() {
  const { user } = useUser();
  const target = user.goalCompanies[0] ?? "Google";
  const progress = roadmapProgress(user.solved);

  return (
    <div>
      <header className="sticky top-0 z-30 px-5 py-3.5 backdrop-blur-xl" style={{ background: "rgba(8,8,13,0.7)" }}>
        <h1 className="text-[22px]">Roadmap</h1>
        <p className="text-[12px] text-muted-foreground">
          Your personalized path to <span className="text-lime">{target}</span>
        </p>
      </header>

      {/* Topic roadmap */}
      <section className="px-5 pt-4">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">DSA FUNDAMENTALS</p>
        <div className="mt-3 space-y-2">
          {ROADMAP.map((node, i) => {
            const isDone = node.status === "completed";
            const isLocked = node.status === "locked";
            const isActive = node.status === "in_progress";
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`relative flex items-center gap-3 rounded-2xl border p-3.5 ${
                  isActive ? "border-lime/30 lime-glow bg-card" : "border-border bg-card"
                } ${isLocked ? "opacity-50" : ""}`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${
                    isDone
                      ? "bg-easy/20 text-easy"
                      : isActive
                      ? "bg-lime/20 text-lime"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {isDone ? "✅" : isActive ? "⚡" : "🔒"}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold">{node.title}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${
                        isDone ? "bg-easy" : "bg-lime"
                      }`}
                      style={{ width: `${node.progress}%` }}
                    />
                  </div>
                </div>
                <p className="font-mono-num text-[12px] font-bold text-muted-foreground">
                  {node.progress}%
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Company packs */}
      <section className="mt-6 px-5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">
          COMPANY PREP PACKS
        </p>
        <div className="mt-3 space-y-3">
          {COMPANY_PACKS.map((p) => {
            const total = p.mix.reduce((a, b) => a + b, 0);
            return (
              <Link
                key={p.slug}
                to="/packs/$slug"
                params={{ slug: p.slug }}
                className="block rounded-2xl border border-border bg-card p-4 transition active:scale-[0.98] hover:border-lime/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-lg">{p.logo}</div>
                    <div>
                      <p className="text-[15px] font-bold">{p.company} <span className="text-muted-foreground">· {p.role}</span></p>
                      <p className="font-mono-num mt-0.5 text-[11px] text-muted-foreground">
                        {p.totalQuestions} questions · {p.loop.length} rounds
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-lime">→</span>
                </div>

                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="bg-easy" style={{ width: `${(p.mix[0] / total) * 100}%` }} />
                  <div className="bg-medium" style={{ width: `${(p.mix[1] / total) * 100}%` }} />
                  <div className="bg-hard" style={{ width: `${(p.mix[2] / total) * 100}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>🟢 {p.mix[0]} · 🟡 {p.mix[1]} · 🔴 {p.mix[2]}</span>
                  <span className={p.difficulty === "BRUTAL" ? "text-red-400" : p.difficulty === "HARD" ? "text-orange-400" : "text-yellow-400"}>
                    {p.difficulty}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Interview calendar */}
      <section className="mt-6 px-5">
        <div className="glass rounded-2xl p-4">
          <p className="text-[11px] font-bold tracking-widest text-cyan">📅 INTERVIEW DATE</p>
          <p className="mt-2 text-[14px] font-semibold">Set your target interview date</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            We'll auto-generate a day-by-day prep plan based on your goal.
          </p>
          <button className="mt-3 w-full rounded-xl border border-lime/40 bg-lime/10 py-2.5 text-[13px] font-bold text-lime transition active:scale-[0.98]">
            Set date →
          </button>
        </div>
      </section>
    </div>
  );
}
