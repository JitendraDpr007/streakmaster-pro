import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useBookmarks } from "@/lib/skillstreak/bookmarks";
import { useQuestions } from "@/lib/skillstreak/questions";
import { ChallengeModal } from "@/components/skillstreak/ChallengeModal";
import { DifficultyBadge, XpBadge, CompanyChip } from "@/components/skillstreak/Badges";
import { CATEGORY_ICON } from "@/lib/skillstreak/data";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks · SkillStreak" },
      { name: "description", content: "Your saved questions and private notes." },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const navigate = useNavigate();
  const { items, loading } = useBookmarks();
  const { data: allQuestions = [] } = useQuestions();
  const [openId, setOpenId] = useState<string | null>(null);

  const saved = items
    .map((b) => ({ b, q: allQuestions.find((q) => q.id === b.question_id) }))
    .filter((x): x is { b: typeof items[number]; q: NonNullable<typeof x.q> } => !!x.q);

  const open = openId ? saved.find((x) => x.q.id === openId)?.q ?? null : null;

  return (
    <div className="px-5 pb-24 pt-5">
      <button
        onClick={() => navigate({ to: "/profile" })}
        className="mb-3 text-[11px] text-muted-foreground active:scale-95"
      >
        ← Back
      </button>
      <div className="text-[10px] uppercase tracking-[0.2em] text-lime">Saved for later</div>
      <h1 className="font-syne text-2xl">Bookmarks</h1>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Your private vault. Notes stay here forever.
      </p>

      <div className="mt-5 space-y-2">
        {loading && (
          <div className="py-10 text-center text-xs text-muted-foreground">Loading…</div>
        )}
        {!loading && saved.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <p className="text-3xl">☆</p>
            <p className="mt-2 text-sm font-bold">No bookmarks yet</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tap ☆ on any question to save it here.
            </p>
            <button
              onClick={() => navigate({ to: "/arena" })}
              className="mt-4 rounded-xl bg-lime px-4 py-2 text-[12px] font-bold text-primary-foreground"
            >
              Browse Arena →
            </button>
          </div>
        )}
        {saved.map(({ b, q }) => (
          <motion.button
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setOpenId(q.id)}
            className="w-full rounded-2xl border border-border bg-card p-4 text-left transition active:scale-[0.99] hover:border-lime/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_ICON[q.category]} {q.category}
                </p>
                <p className="mt-0.5 truncate text-[14px] font-bold">{q.title}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <DifficultyBadge d={q.difficulty} />
                <XpBadge xp={q.xp} />
              </div>
            </div>
            {b.note && (
              <p className="mt-3 rounded-lg border-l-2 border-lime bg-white/[0.03] px-3 py-2 text-[12px] italic leading-snug text-foreground/80">
                {b.note}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {q.companies.slice(0, 3).map((c) => (
                <CompanyChip key={c} name={c} />
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && <ChallengeModal question={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  );
}
