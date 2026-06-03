import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LEADERBOARD } from "@/lib/skillstreak/data";
import { useUser } from "@/lib/skillstreak/store";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard · SkillStreak" }] }),
  component: Leaderboard,
});

const TABS = ["This Week", "All Time", "My College", "My Company"] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

function Leaderboard() {
  const { user } = useUser();
  const [tab, setTab] = useState<(typeof TABS)[number]>("This Week");

  const me = { name: user.name, college: "Your college", xp: user.xp, streak: user.streak };
  const board = useMemo(() => {
    const all = [...LEADERBOARD, me]
      .sort((a, b) => b.xp - a.xp)
      .map((r, i) => ({ ...r, rank: i + 1 }));
    return all;
  }, [user.xp, user.streak, user.name]);

  const myRow = board.find((r) => r.name === user.name)!;
  const rival = board[Math.max(0, myRow.rank - 2)];
  const gap = rival ? rival.xp - me.xp : 0;

  return (
    <div>
      <header className="sticky top-0 z-30 px-5 py-3.5 backdrop-blur-xl" style={{ background: "rgba(8,8,13,0.7)" }}>
        <h1 className="text-[22px]">Leaderboard</h1>
        <p className="text-[12px] text-muted-foreground">Climb the ranks. Earn the bragging rights.</p>
      </header>

      <div className="no-scrollbar overflow-x-auto px-5 pb-3">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${
                tab === t
                  ? "border-lime bg-lime text-primary-foreground"
                  : "border-border bg-white/[0.03] text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Rival card */}
      {rival && rival.name !== user.name && gap > 0 && (
        <div className="mx-5 mb-3 rounded-2xl border border-cyan/30 bg-[oklch(0.86_0.16_210/0.06)] p-3.5">
          <p className="text-[10px] font-bold tracking-widest text-cyan">🎯 YOUR RIVAL</p>
          <p className="mt-1.5 text-[13px]">
            You're <span className="font-mono-num font-bold text-cyan">{gap.toLocaleString()} XP</span> behind{" "}
            <span className="font-bold">{rival.name}</span>. Solve 2 more today to overtake 🔥
          </p>
        </div>
      )}

      {/* Board */}
      <div className="space-y-1.5 px-5">
        {board.slice(0, 10).map((row) => {
          const isMe = row.name === user.name;
          const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
          return (
            <div
              key={row.name}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                isMe ? "border-lime/40 bg-[oklch(0.92_0.22_125/0.08)] lime-glow" : "border-border bg-card"
              }`}
            >
              <div className="font-mono-num w-7 text-center text-[13px] font-bold text-muted-foreground">
                {medal ?? `#${row.rank}`}
              </div>
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold ${
                  row.rank === 1
                    ? "bg-gold/20 text-gold"
                    : row.rank <= 3
                    ? "bg-cyan/20 text-cyan"
                    : "bg-white/5 text-foreground"
                }`}
              >
                {initials(row.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold">
                  {row.name} {isMe && <span className="text-lime">· you</span>}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{row.college}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-num text-[13px] font-bold text-lime">{row.xp.toLocaleString()}</p>
                <p className="font-mono-num text-[10px] text-muted-foreground">🔥 {row.streak}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
