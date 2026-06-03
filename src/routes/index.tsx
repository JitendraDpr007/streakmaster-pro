import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_ICON } from "@/lib/skillstreak/data";
import { useQuestions } from "@/lib/skillstreak/questions";
import { useUser } from "@/lib/skillstreak/store";
import { ChallengeModal } from "@/components/skillstreak/ChallengeModal";
import { CompanyChip, DifficultyBadge, XpBadge } from "@/components/skillstreak/Badges";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillStreak — Your daily prep" },
      { name: "description", content: "Three daily challenges. Built for Indian devs cracking Google, Uber, Razorpay & more." },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, ready } = useUser();
  const navigate = useNavigate();
  const { data: allQuestions = [] } = useQuestions();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user.onboarded) navigate({ to: "/onboarding" });
  }, [ready, user.onboarded, navigate]);

  const challenges = useMemo(() => allQuestions.slice(0, 3), [allQuestions]);
  const doneCount = challenges.filter((q) => user.solved.includes(q.id)).length;
  const open = openId ? challenges.find((q) => q.id === openId) ?? null : null;

  const headline = useMemo(() => {
    if (doneCount === 0) return "3 challenges to greatness.";
    if (doneCount < 3) return `You're ${3 - doneCount} solve${3 - doneCount === 1 ? "" : "s"} away from a ${user.streak + 1}-day streak.`;
    return "Daily goal smashed. Beast.";
  }, [doneCount, user.streak]);

  return (
    <div className="relative">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 backdrop-blur-xl" style={{ background: "rgba(8,8,13,0.7)" }}>
        <div className="font-display text-[15px] font-extrabold tracking-tight">
          <span className="text-foreground">SKILL</span>
          <span className="text-lime">STREAK</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono-num flex items-center gap-1 text-[13px] font-bold">
            <span className="pulse-fire">🔥</span>
            <span>{user.streak}</span>
          </div>
          <div className="font-mono-num text-[13px] font-bold text-lime">⚡ {user.xp.toLocaleString()}</div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-6 pt-4">
        <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />
        <div className="relative">
          <p className="text-[13px] text-muted-foreground">Morning, {user.name} 👋</p>
          <h1 className="mt-1 text-[28px] leading-[1.1]">{headline}</h1>
        </div>
      </section>

      {/* Daily Challenges */}
      <section className="space-y-3 px-5">
        {challenges.map((q, i) => {
          const done = user.solved.includes(q.id);
          return (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setOpenId(q.id)}
              className={`group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition active:scale-[0.99] ${
                done ? "opacity-60" : "hover:border-lime/30 hover:lime-glow"
              }`}
            >
              <div
                className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-lime opacity-0 transition group-hover:opacity-100"
                style={{ boxShadow: "0 0 12px rgba(205,255,71,0.6)" }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{CATEGORY_ICON[q.category]}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {q.category}
                    </p>
                    <p className="text-[15px] font-bold">{q.subcategory.split(" · ")[0]}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <DifficultyBadge d={q.difficulty} />
                  <XpBadge xp={q.xp} />
                </div>
              </div>

              <p className="mt-3 text-[12px] text-muted-foreground">
                Asked at: <span className="text-foreground/80">{q.companies.join(" · ")}</span>
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-lime">
                  {done ? "✅ Done" : "Solve now →"}
                </span>
                <div className="flex gap-1">
                  {q.companies.slice(0, 3).map((c) => (
                    <CompanyChip key={c} name={c} />
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </section>

      {/* Daily Bonus */}
      <section className="mt-5 px-5">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Daily Bonus</p>
            <p className="font-mono-num text-[13px] font-bold text-lime">{doneCount}/3</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-lime"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / 3) * 100}%` }}
              transition={{ type: "spring", stiffness: 80 }}
              style={{ boxShadow: "0 0 12px rgba(205,255,71,0.6)" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Complete all 3 → <span className="font-mono-num font-bold text-lime">+100 XP</span> + keep your streak alive.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mt-5 grid grid-cols-4 gap-2 px-5">
        <Stat icon="🔥" label="Streak" value={user.streak} />
        <Stat icon="⚡" label="XP" value={user.xp} />
        <Stat icon="✅" label="Solved" value={user.solved.length} />
        <Stat icon="📊" label="Rank" value="#247" />
      </section>

      {/* Did you know */}
      <section className="mt-5 px-5">
        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-4"
          style={{ boxShadow: "inset 3px 0 0 0 #CDFF47" }}
        >
          <p className="text-[10px] font-bold tracking-widest text-lime">DID YOU KNOW?</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">
            Google rejects <span className="font-bold text-foreground">95%</span> of DSA candidates for not knowing time complexity cold. Do you know yours?
          </p>
        </div>
      </section>

      <AnimatePresence>{open && <ChallengeModal question={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5 text-center">
      <p className="text-base">{icon}</p>
      <p className="font-mono-num mt-0.5 text-[13px] font-bold">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
