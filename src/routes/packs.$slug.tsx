import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { getPack, COMPANY_PACKS } from "@/lib/skillstreak/packs";

export const Route = createFileRoute("/packs/$slug")({
  head: ({ params }) => {
    const pack = getPack(params.slug);
    return {
      meta: [
        { title: `${pack?.company ?? "Company"} Prep Pack · SkillStreak` },
        {
          name: "description",
          content: pack?.tagline ?? "Deep prep pack for top product companies.",
        },
      ],
    };
  },
  component: PackDetail,
  notFoundComponent: () => (
    <div className="px-5 py-10 text-center">
      <p className="text-sm text-muted-foreground">Pack not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-5 py-10 text-center">
      <p className="text-sm text-red-400">{error.message}</p>
    </div>
  ),
});

type Tab = "loop" | "topics" | "questions" | "comp" | "plan";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "loop", label: "Loop", icon: "🎯" },
  { id: "topics", label: "Topics", icon: "📊" },
  { id: "questions", label: "Top Qs", icon: "🧠" },
  { id: "comp", label: "Comp", icon: "💰" },
  { id: "plan", label: "Plan", icon: "📅" },
];

function PackDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const pack = getPack(slug);
  const [tab, setTab] = useState<Tab>("loop");

  if (!pack) {
    return (
      <div className="px-5 py-10 text-center text-sm text-muted-foreground">
        Pack not found.{" "}
        <Link to="/roadmap" className="text-lime">
          Back to roadmap
        </Link>
      </div>
    );
  }

  const diffColor =
    pack.difficulty === "BRUTAL"
      ? "text-red-400"
      : pack.difficulty === "HARD"
        ? "text-orange-400"
        : "text-yellow-400";

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top, hsl(var(--lime)/0.2), transparent 60%)",
          }}
        />
        <div className="relative px-5 pb-5 pt-6">
          <button
            onClick={() => navigate({ to: "/roadmap" })}
            className="mb-3 text-[11px] text-muted-foreground active:scale-95"
          >
            ← Roadmap
          </button>
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-3xl">
              {pack.logo}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-syne text-2xl leading-tight">{pack.company}</h1>
              <p className="text-[11px] text-muted-foreground">{pack.role}</p>
            </div>
            <div className={`text-right text-[10px] font-bold ${diffColor}`}>
              <div>{pack.difficulty}</div>
              <div className="font-mono text-[9px] text-muted-foreground">
                hire bar
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/80">{pack.tagline}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="text-lime">▸</span> {pack.hireBar}
          </p>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Questions" value={pack.totalQuestions.toString()} />
            <Stat label="Rounds" value={pack.loop.length.toString()} />
            <Stat
              label="Mix"
              value={`${pack.mix[0]}/${pack.mix[1]}/${pack.mix[2]}`}
              mono
            />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-white/5 bg-[#08080D]/90 px-5 py-3 backdrop-blur-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
              tab === t.id
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/10 text-muted-foreground"
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        {tab === "loop" && <LoopView pack={pack} />}
        {tab === "topics" && <TopicsView pack={pack} />}
        {tab === "questions" && <QuestionsView pack={pack} />}
        {tab === "comp" && <CompView pack={pack} />}
        {tab === "plan" && <PlanView pack={pack} />}
      </div>

      {/* Insider tips strip */}
      <div className="mt-6 px-5">
        <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan">
            🤫 Insider Tips
          </p>
          <ul className="mt-2 space-y-1.5">
            {pack.insiderTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-snug">
                <span className="text-cyan">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recently asked */}
      <div className="mt-4 px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          🔥 Recently Asked (last 3 months)
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pack.recentlyAsked.map((q, i) => (
            <span
              key={i}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-foreground/80"
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 px-5">
        <button
          onClick={() => navigate({ to: "/arena" })}
          className="w-full rounded-2xl bg-lime py-4 text-sm font-bold text-primary-foreground active:scale-[0.98]"
        >
          Start {pack.company} prep →
        </button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Questions are tagged with {pack.company} in the Arena
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-2.5">
      <div className={`text-base font-bold text-lime ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function LoopView({ pack }: { pack: ReturnType<typeof getPack> & object }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        The {pack.loop.length}-Round Loop
      </p>
      {pack.loop.map((round, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime/10 font-mono text-sm font-bold text-lime">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold">{round.name}</h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {round.duration}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-foreground/80">{round.focus}</p>
              <p className="mt-2 rounded-lg border border-lime/20 bg-lime/5 p-2 text-[11px] leading-snug text-lime">
                💡 {round.tips}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TopicsView({ pack }: { pack: ReturnType<typeof getPack> & object }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Topic weight (what they actually ask)
      </p>
      {pack.topTopics.map((t, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-card p-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold">{t.topic}</span>
            <span className="font-mono text-lime">{t.weight}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${t.weight * 3}%` }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="h-full rounded-full bg-gradient-to-r from-lime to-cyan"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionsView({ pack }: { pack: ReturnType<typeof getPack> & object }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Top {pack.topQuestions.length} most-asked questions
      </p>
      {pack.topQuestions.map((q, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-white/10 bg-card p-3"
        >
          <span className="font-mono text-[11px] font-bold text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[12px] leading-snug">{q}</span>
        </div>
      ))}
    </div>
  );
}

function CompView({ pack }: { pack: ReturnType<typeof getPack> & object }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        India compensation bands (annual, total)
      </p>
      {pack.comp.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-card p-4"
        >
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold">{c.level}</h3>
            <span className="font-mono text-base font-bold text-lime">{c.total}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
            <CompCell label="Base" value={c.base} />
            <CompCell label="Stock/yr" value={c.stock} />
            <CompCell label="Bonus" value={c.bonus} />
          </div>
        </motion.div>
      ))}
      <p className="pt-2 text-center text-[10px] text-muted-foreground">
        Data crowdsourced from levels.fyi & community posts (2025).
      </p>
    </div>
  );
}

function CompCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="font-mono text-[11px] font-semibold">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function PlanView({ pack }: { pack: ReturnType<typeof getPack> & object }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        4-Week prep plan
      </p>
      {pack.prepPlan.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lime/10 font-mono text-xs font-bold text-lime">
              W{w.week}
            </div>
            <h3 className="text-sm font-bold">{w.theme}</h3>
          </div>
          <ul className="mt-3 space-y-1.5 pl-12">
            {w.tasks.map((t, j) => (
              <li key={j} className="flex gap-2 text-[12px]">
                <span className="text-lime">☐</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// Re-export so other modules can find the full pack list without re-importing
export { COMPANY_PACKS };
