import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ACHIEVEMENTS, levelFor } from "@/lib/skillstreak/data";
import { useUser } from "@/lib/skillstreak/store";
import { useAuth } from "@/lib/skillstreak/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · SkillStreak" }] }),
  component: Profile,
});

const SKILLS = [
  { label: "DSA", value: 0.8 },
  { label: "SQL", value: 0.6 },
  { label: "System Design", value: 0.45 },
  { label: "OS", value: 0.55 },
  { label: "Behavioral", value: 0.7 },
  { label: "Resume", value: 0.5 },
];

function initials(n: string) {
  return n.split(" ").map((s) => s[0]).slice(0, 2).join("");
}

function Profile() {
  const { user, patch } = useUser();
  const { user: authUser, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const lvl = levelFor(user.xp);
  const pct = ((user.xp - lvl.min) / (lvl.next.min - lvl.min || 1)) * 100;

  return (
    <div>
      <header className="px-5 pt-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-[20px] font-extrabold ring-2 ring-lime ring-offset-2 ring-offset-[#08080D]">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px]">{user.name}</h1>
            <p className="text-[12px] text-muted-foreground">{user.level} · Targeting {user.target}</p>
            <p className="font-mono-num mt-1 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
              <span className={user.streak >= 7 ? "pulse-fire" : ""}>🔥</span>
              {user.streak} day streak
            </p>
          </div>
        </div>
      </header>

      {/* Level */}
      <section className="mt-5 px-5">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground">CURRENT LEVEL</p>
              <p className="mt-0.5 text-[18px] font-extrabold">{lvl.name}</p>
            </div>
            <div className="text-right">
              <p className="font-mono-num text-[18px] font-bold text-lime">{user.xp.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">XP</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-lime"
              style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(205,255,71,0.6)" }}
            />
          </div>
          <p className="font-mono-num mt-2 text-[11px] text-muted-foreground">
            {(lvl.next.min - user.xp).toLocaleString()} XP to <span className="text-foreground">{lvl.next.name}</span>
          </p>
        </div>
      </section>

      {/* Heatmap */}
      <section className="mt-5 px-5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">LAST 90 DAYS</p>
        <div className="mt-3 grid grid-cols-[repeat(15,1fr)] gap-1">
          {user.solvedHistory.slice(-90).map((d) => {
            const intensity =
              d.count === 0 ? 0.05 : d.count === 1 ? 0.25 : d.count === 2 ? 0.55 : 0.95;
            return (
              <div
                key={d.date}
                className="aspect-square rounded-[3px]"
                style={{ background: `rgba(205,255,71,${intensity})` }}
                title={`${d.date} · ${d.count}`}
              />
            );
          })}
        </div>
      </section>

      {/* Radar */}
      <section className="mt-6 px-5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">SKILLS RADAR</p>
        <div className="mt-3 flex justify-center rounded-2xl border border-border bg-card p-4">
          <SkillsRadar />
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-6 px-5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">ACHIEVEMENTS</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const earned = user.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`rounded-xl border p-3 text-center transition ${
                  earned
                    ? "border-lime/30 bg-[oklch(0.92_0.22_125/0.06)]"
                    : "border-border bg-card opacity-50"
                }`}
              >
                <p className="text-2xl">{a.icon}</p>
                <p className="mt-1 text-[11px] font-bold leading-tight">{a.title}</p>
                <p className="text-[9px] text-muted-foreground">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target companies */}
      <section className="mt-6 px-5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">TARGET COMPANIES</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {user.goalCompanies.map((c) => (
            <span
              key={c}
              className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-[12px] font-semibold text-lime"
            >
              {c}
            </span>
          ))}
          <button className="rounded-full border border-dashed border-border px-3 py-1 text-[12px] text-muted-foreground">
            + Add
          </button>
        </div>
      </section>

      <section className="mt-8 space-y-2 px-5">
        {authUser?.email && (
          <p className="text-center text-[11px] text-muted-foreground">
            Signed in as {authUser.email}
          </p>
        )}
        {isAdmin && (
          <button
            onClick={() => navigate({ to: "/admin" })}
            className="w-full rounded-xl border border-lime/40 bg-lime/10 py-2.5 text-[12px] font-semibold text-lime"
          >
            Admin Panel
          </button>
        )}
        <button
          onClick={() => patch({ onboarded: false })}
          className="w-full rounded-xl border border-border bg-card py-2.5 text-[12px] font-semibold text-muted-foreground"
        >
          Redo onboarding
        </button>
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/auth" });
          }}
          className="w-full rounded-xl border border-red-500/30 bg-red-500/5 py-2.5 text-[12px] font-semibold text-red-400"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}

function SkillsRadar() {
  const size = 220;
  const c = size / 2;
  const r = size / 2 - 24;
  const n = SKILLS.length;
  const pts = SKILLS.map((s, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: c + Math.cos(a) * r * s.value,
      y: c + Math.sin(a) * r * s.value,
      lx: c + Math.cos(a) * (r + 14),
      ly: c + Math.sin(a) * (r + 14),
      label: s.label,
    };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const rings = [0.33, 0.66, 1];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((rr, i) => (
        <polygon
          key={i}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          points={Array.from({ length: n })
            .map((_, j) => {
              const a = (Math.PI * 2 * j) / n - Math.PI / 2;
              return `${c + Math.cos(a) * r * rr},${c + Math.sin(a) * r * rr}`;
            })
            .join(" ")}
        />
      ))}
      <path d={path} fill="rgba(205,255,71,0.25)" stroke="#CDFF47" strokeWidth={1.5} />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={3} fill="#CDFF47" />
          <text
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.6)"
            fontWeight={600}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
