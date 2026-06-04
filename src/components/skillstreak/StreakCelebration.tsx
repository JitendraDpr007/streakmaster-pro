import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@/lib/skillstreak/store";

const COPY: Record<number, { title: string; sub: string }> = {
  3: { title: "3-Day Spark", sub: "The hardest part is over. Don't break it." },
  7: { title: "7-Day Warrior", sub: "You're now in the top 12% of streakers. 🔥" },
  14: { title: "Fortnight Fire", sub: "Two weeks of compounding. Insane." },
  30: { title: "Iron Month", sub: "30 days. You're built different now." },
  50: { title: "Half-Century", sub: "50 days. Recruiters notice this kind of consistency." },
  100: { title: "Centurion", sub: "100 days. You're a top 1% prepper. Ship that resume." },
};

export function StreakCelebration() {
  const { streakMilestone, clearStreakMilestone, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!streakMilestone) return;
    const burst = () =>
      confetti({
        particleCount: 140,
        spread: 100,
        startVelocity: 45,
        origin: { y: 0.4 },
        colors: ["#CDFF47", "#47F3FF", "#FFD700", "#FF6B9D"],
      });
    burst();
    const t1 = setTimeout(burst, 350);
    const t2 = setTimeout(burst, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [streakMilestone]);

  if (!streakMilestone) return null;
  const copy = COPY[streakMilestone] ?? {
    title: `${streakMilestone}-Day Streak`,
    sub: "Unstoppable.",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] grid place-items-center bg-black/80 backdrop-blur-md px-6"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          className="relative w-full max-w-[380px] rounded-3xl border border-lime/40 bg-[#0F0F17] p-7 text-center lime-glow"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-7xl"
          >
            🔥
          </motion.div>
          <p className="mt-3 font-mono-num text-[11px] font-bold tracking-[0.25em] text-lime">
            DAY {streakMilestone} UNLOCKED
          </p>
          <h2 className="font-syne mt-2 text-3xl leading-tight">{copy.title}</h2>
          <p className="mt-2 text-[13px] text-muted-foreground">{copy.sub}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Streak</p>
              <p className="font-mono-num mt-1 text-2xl font-bold text-lime">{user.streak}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">XP</p>
              <p className="font-mono-num mt-1 text-2xl font-bold">{user.xp.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={clearStreakMilestone}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-[13px] font-bold text-muted-foreground active:scale-[0.97]"
            >
              Keep going
            </button>
            <button
              onClick={() => {
                clearStreakMilestone();
                navigate({ to: "/share" });
              }}
              className="flex-1 rounded-xl bg-lime py-3 text-[13px] font-extrabold text-primary-foreground active:scale-[0.97]"
            >
              Share 🚀
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
