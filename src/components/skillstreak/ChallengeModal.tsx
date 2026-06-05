import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CompanyChip, DifficultyBadge, XpBadge } from "./Badges";
import { useUser } from "@/lib/skillstreak/store";
import { useBookmarks } from "@/lib/skillstreak/bookmarks";
import { type Question, TYPE_LABEL } from "@/lib/skillstreak/data";
import { CodingSolver } from "./solvers/CodingSolver";
import { SqlSolver } from "./solvers/SqlSolver";
import { SystemDesignSolver } from "./solvers/SystemDesignSolver";

export function ChallengeModal({
  question,
  onClose,
}: {
  question: Question;
  onClose: () => void;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(question.id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-3xl border-t border-border bg-[#0F0F17] p-5 sm:rounded-3xl sm:border"
      >
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            onClick={() => toggle(question.id)}
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
            className={`grid h-8 w-8 place-items-center rounded-full text-[14px] transition active:scale-90 ${
              bookmarked
                ? "bg-lime/15 text-lime"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {bookmarked ? "★" : "☆"}
          </button>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-muted-foreground transition hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan">
            {TYPE_LABEL[question.type]}
          </span>
          <DifficultyBadge d={question.difficulty} />
          <XpBadge xp={question.xp} />
        </div>

        <h2 className="text-xl leading-tight">{question.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{question.subcategory}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {question.companies.slice(0, 4).map((c) => (
            <CompanyChip key={c} name={c} />
          ))}
        </div>

        {question.story && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground">
              SCENARIO
            </p>
            <p className="text-[13px] leading-relaxed text-foreground/85">{question.story}</p>
          </div>
        )}

        <div className="mt-5">
          {question.type === "mcq" && <McqSolver question={question} />}
          {question.type === "coding" && <CodingSolver question={question} />}
          {question.type === "sql" && <SqlSolver question={question} />}
          {question.type === "system_design" && <SystemDesignSolver question={question} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function McqSolver({ question }: { question: Question }) {
  const { user, recordSolve } = useUser();
  const alreadySolved = user.solved.includes(question.id);
  const [selected, setSelected] = useState<number | null>(
    alreadySolved ? question.correctIndex : null,
  );
  const [revealed, setRevealed] = useState(alreadySolved);
  const [floatXp, setFloatXp] = useState(false);

  const pick = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === question.correctIndex) {
      recordSolve(question.id, question.xp, i);
      setFloatXp(true);
      setTimeout(() => setFloatXp(false), 1200);
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 35,
        origin: { y: 0.3 },
        colors: ["#CDFF47", "#47F3FF", "#FFD700"],
      });
    }
  };

  const correct = selected === question.correctIndex;

  return (
    <>
      <p className="text-[14px] font-medium leading-relaxed">{question.question}</p>

      <div className="mt-4 space-y-2">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = selected === i;
          let style =
            "border-border bg-white/[0.03] hover:border-white/20 active:scale-[0.98]";
          if (revealed) {
            if (isCorrect) style = "border-easy/60 bg-[oklch(0.78_0.18_145/0.12)]";
            else if (isSelected) style = "border-hard/60 bg-[oklch(0.65_0.24_25/0.12)]";
            else style = "border-border bg-white/[0.02] opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${style}`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold ${
                  revealed && isCorrect
                    ? "border-easy/60 bg-easy/20 text-easy"
                    : revealed && isSelected
                      ? "border-hard/60 bg-hard/20 text-hard"
                      : "border-border bg-white/5 text-muted-foreground"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-mono-num pt-0.5 text-[13px] leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {floatXp && (
          <motion.div
            className="font-mono-num pointer-events-none fixed bottom-[40%] left-1/2 z-[70] -translate-x-1/2 text-3xl font-bold text-lime float-up"
            initial={{ opacity: 1 }}
          >
            +{question.xp} XP
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className={`mt-5 rounded-xl border p-3 text-[13px] font-semibold ${
                correct
                  ? "border-easy/40 bg-[oklch(0.78_0.18_145/0.1)] text-easy"
                  : "border-hard/40 bg-[oklch(0.65_0.24_25/0.1)] text-hard"
              }`}
            >
              {correct ? "Nailed it. Here's the depth ↓" : "Not quite — here's why ↓"}
            </div>

            <Section title="WHY THIS IS CORRECT">
              <p className="text-[13px] leading-relaxed text-foreground/85">
                {question.explanation}
              </p>
            </Section>

            {question.whyOthersWrong && (
              <Section title="WHY THE OTHERS ARE WRONG">
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {question.whyOthersWrong}
                </p>
              </Section>
            )}

            {question.complexity && (
              <Section title="COMPLEXITY">
                <p className="font-mono-num text-[13px] text-cyan">{question.complexity}</p>
              </Section>
            )}

            {question.interviewTip && (
              <Section title="HOW TO EXPLAIN IT IN AN INTERVIEW">
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {question.interviewTip}
                </p>
              </Section>
            )}

            {question.followup && (
              <Section title="FOLLOW-UP THE INTERVIEWER WILL ASK">
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {question.followup}
                </p>
              </Section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-1.5 text-[10px] font-bold tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}
