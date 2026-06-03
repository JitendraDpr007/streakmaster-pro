import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_ICON, COMPANIES, type Category } from "@/lib/skillstreak/data";
import { useQuestions } from "@/lib/skillstreak/questions";
import { CompanyChip, DifficultyBadge, XpBadge } from "@/components/skillstreak/Badges";
import { ChallengeModal } from "@/components/skillstreak/ChallengeModal";

const CATS: (Category | "All")[] = ["All", "DSA", "SQL", "System Design", "Behavioral"];

export const Route = createFileRoute("/arena")({
  head: () => ({ meta: [{ title: "Arena · SkillStreak" }] }),
  component: Arena,
});

function Arena() {
  const [company, setCompany] = useState("All");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: QUESTIONS = [] } = useQuestions();

  const filtered = QUESTIONS.filter(
    (q) =>
      (company === "All" || q.companies.includes(company)) &&
      (cat === "All" || q.category === cat),
  );

  const open = openId ? filtered.find((q) => q.id === openId) ?? null : null;

  return (
    <div>
      <header className="sticky top-0 z-30 px-5 py-3.5 backdrop-blur-xl" style={{ background: "rgba(8,8,13,0.7)" }}>
        <h1 className="text-[22px]">Arena</h1>
        <p className="text-[12px] text-muted-foreground">Pick your fight.</p>
      </header>

      {/* Company filter */}
      <div className="no-scrollbar overflow-x-auto px-5">
        <div className="flex gap-2 pb-3">
          {["All", ...COMPANIES.slice(0, 7)].map((c) => (
            <button
              key={c}
              onClick={() => setCompany(c)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition active:scale-95 ${
                company === c
                  ? "border-lime bg-lime text-primary-foreground"
                  : "border-border bg-white/[0.03] text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="no-scrollbar overflow-x-auto px-5">
        <div className="flex gap-2 pb-3">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                cat === c
                  ? "border-cyan/50 bg-cyan/10 text-cyan"
                  : "border-border bg-white/[0.03] text-muted-foreground"
              }`}
            >
              {c === "All" ? "All" : `${CATEGORY_ICON[c as Category]} ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3 px-5 pt-2">
        {filtered.map((q, i) => (
          <motion.button
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            onClick={() => setOpenId(q.id)}
            className="w-full rounded-2xl border border-border bg-card p-4 text-left transition hover:border-lime/30 active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_ICON[q.category]} {q.category}
                </p>
                <p className="mt-0.5 text-[15px] font-bold leading-tight">{q.title}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <DifficultyBadge d={q.difficulty} />
                <XpBadge xp={q.xp} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {q.companies.map((c) => (
                <CompanyChip key={c} name={c} />
              ))}
            </div>
            <p className="font-mono-num mt-3 text-[11px] text-muted-foreground">
              {Math.floor(Math.random() * 4000 + 800).toLocaleString()} developers solved this today
            </p>
          </motion.button>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-3xl">🎯</p>
            <p className="mt-2 font-bold">No challenges match those filters</p>
            <p className="mt-1 text-[12px] text-muted-foreground">Try a different company or category.</p>
          </div>
        )}
      </div>

      <AnimatePresence>{open && <ChallengeModal question={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  );
}
