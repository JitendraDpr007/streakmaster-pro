import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DesignSection, Question } from "@/lib/skillstreak/data";
import { useUser } from "@/lib/skillstreak/store";
import { AiCoachDrawer } from "@/components/skillstreak/AiCoachDrawer";

type Phase = "reqs" | "hld" | "lld" | "tradeoffs";

const PHASES: { id: Phase; label: string; icon: string }[] = [
  { id: "reqs", label: "Requirements", icon: "📋" },
  { id: "hld", label: "HLD", icon: "🏛️" },
  { id: "lld", label: "LLD", icon: "🔧" },
  { id: "tradeoffs", label: "Tradeoffs", icon: "⚖️" },
];

export function SystemDesignSolver({ question }: { question: Question }) {
  const { user, recordSolve } = useUser();
  const solved = user.solved.includes(question.id);
  const [phase, setPhase] = useState<Phase>("reqs");
  const [coachOpen, setCoachOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const sections =
    phase === "reqs"
      ? question.requirements
      : phase === "hld"
        ? question.hld
        : phase === "lld"
          ? question.lld
          : question.tradeoffs;

  const toggle = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const allChecked = (sections ?? []).every((s, si) =>
    s.points.every((_, pi) => checked[`${phase}-${si}-${pi}`]),
  );

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-[12px] leading-relaxed">
          <span className="font-bold text-cyan">How to proceed:</span> Walk through{" "}
          <b>Requirements → HLD → LLD → Tradeoffs</b>. Tick off each point as you
          mentally cover it. Stuck? Tap{" "}
          <span className="font-bold text-lime">Discuss with AI Coach</span> for a
          live mock interview.
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPhase(p.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                phase === p.id
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-white/10 bg-card text-muted-foreground"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            {(sections ?? []).map((s: DesignSection, si) => (
              <div key={si} className="rounded-xl border border-white/10 bg-card p-3">
                <p className="mb-2 text-[12px] font-bold text-lime">{s.title}</p>
                <ul className="space-y-1.5">
                  {s.points.map((pt, pi) => {
                    const k = `${phase}-${si}-${pi}`;
                    return (
                      <li key={pi} className="flex items-start gap-2">
                        <button
                          onClick={() => toggle(k)}
                          className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[9px] ${
                            checked[k]
                              ? "border-lime bg-lime text-primary-foreground"
                              : "border-white/20"
                          }`}
                        >
                          {checked[k] ? "✓" : ""}
                        </button>
                        <span
                          className={`text-[12px] leading-relaxed ${
                            checked[k] ? "text-muted-foreground line-through" : "text-foreground/85"
                          }`}
                        >
                          {pt}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {(sections ?? []).length === 0 && (
              <p className="text-[12px] text-muted-foreground">
                No content for this phase yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {allChecked && phase === "tradeoffs" && !solved && (
          <button
            onClick={() => recordSolve(question.id, question.xp, 0)}
            className="w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Complete walkthrough (+{question.xp} XP)
          </button>
        )}
      </div>

      <button
        onClick={() => setCoachOpen(true)}
        className="fixed bottom-4 right-4 z-[65] rounded-full bg-cyan px-4 py-3 text-[12px] font-bold text-primary-foreground shadow-lg active:scale-95"
        style={{ boxShadow: "0 0 24px rgba(71,243,255,0.5)" }}
      >
        🤖 Discuss with AI Coach
      </button>

      <AnimatePresence>
        {coachOpen && (
          <AiCoachDrawer
            question={question}
            phase={phase}
            onClose={() => setCoachOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
