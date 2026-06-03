import type { Difficulty } from "@/lib/skillstreak/data";

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const color =
    d === "EASY"
      ? "bg-[oklch(0.78_0.18_145/0.15)] text-easy border-[oklch(0.78_0.18_145/0.3)]"
      : d === "MEDIUM"
      ? "bg-[oklch(0.82_0.17_85/0.15)] text-medium border-[oklch(0.82_0.17_85/0.3)]"
      : "bg-[oklch(0.65_0.24_25/0.15)] text-hard border-[oklch(0.65_0.24_25/0.3)]";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${color}`}
    >
      {d}
    </span>
  );
}

export function XpBadge({ xp }: { xp: number }) {
  return (
    <span className="font-mono-num inline-flex items-center gap-1 rounded-md border border-[oklch(0.92_0.22_125/0.3)] bg-[oklch(0.92_0.22_125/0.1)] px-1.5 py-0.5 text-[10px] font-bold text-lime">
      +{xp} XP
    </span>
  );
}

export function CompanyChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {name}
    </span>
  );
}
