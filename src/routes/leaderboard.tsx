import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/skillstreak/store";
import { useAuth } from "@/lib/skillstreak/auth";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard · SkillStreak" }] }),
  component: Leaderboard,
});

const TABS = ["All Time", "This Week"] as const;

function initials(name: string) {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("");
}

function Leaderboard() {
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All Time");

  const { data: board = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .limit(50);
      if (error) throw error;
      return data as Array<{ id: string; name: string; college: string | null; xp: number; streak: number; longest_streak: number }>;
    },
  });

  const ranked = board.map((r, i) => ({ ...r, rank: i + 1 }));
  const myRow = ranked.find((r) => r.id === authUser?.id);
  const rival = myRow && myRow.rank > 1 ? ranked[myRow.rank - 2] : null;
  const gap = rival && myRow ? rival.xp - myRow.xp : 0;

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

      {rival && gap > 0 && (
        <div className="mx-5 mb-3 rounded-2xl border border-cyan/30 bg-[oklch(0.86_0.16_210/0.06)] p-3.5">
          <p className="text-[10px] font-bold tracking-widest text-cyan">🎯 YOUR RIVAL</p>
          <p className="mt-1.5 text-[13px]">
            You're <span className="font-mono-num font-bold text-cyan">{gap.toLocaleString()} XP</span> behind{" "}
            <span className="font-bold">{rival.name}</span>. Solve 2 more today to overtake 🔥
          </p>
        </div>
      )}

      <div className="space-y-1.5 px-5">
        {ranked.slice(0, 20).map((row) => {
          const isMe = row.id === authUser?.id;
          const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
          return (
            <div
              key={row.id}
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
                <p className="truncate text-[11px] text-muted-foreground">{row.college ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-num text-[13px] font-bold text-lime">{row.xp.toLocaleString()}</p>
                <p className="font-mono-num text-[10px] text-muted-foreground">🔥 {row.streak}</p>
              </div>
            </div>
          );
        })}
        {ranked.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-3xl">🏆</p>
            <p className="mt-2 font-bold">Be the first on the board</p>
            <p className="mt-1 text-[12px] text-muted-foreground">Solve a challenge to earn your spot.</p>
          </div>
        )}
      </div>
    </div>
  );
}
