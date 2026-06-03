# SkillStreak — "One-Stop Prep" Roadmap

Goal: everything an Indian dev needs to switch into a top product company, in one app. No paywalls.

I'll ship in 5 phases. Each phase is independently usable — you'll see progress after every one.

---

## Phase 1 — Real Backend (foundation for everything else)
Enable **Lovable Cloud** so data persists across devices and users.

- Email + Google auth (your email `rachitmisra0398@gmail.com` auto-promoted to admin via a `user_roles` table)
- Tables: `profiles`, `questions`, `submissions`, `streaks`, `companies`, `roadmap_progress`, `bookmarks`, `notes`, `user_roles`
- Real leaderboard (live XP ranks, weekly + all-time)
- Admin panel writes go to DB (replaces localStorage)
- Daily streak + XP computed server-side (no cheating)

## Phase 2 — Deep Content Library (the "last app you'll need" part)
Seed 80+ hand-picked questions across:

- **DSA** (Arrays, Strings, Trees, Graphs, DP, Sliding Window, Heaps) — 40 Qs
- **SQL** (Joins, Windows, CTEs, Optimization) — 15 Qs
- **System Design** (URL shortener, Rate limiter, Feed, Chat, Uber dispatch) — 10 Qs
- **DBMS / OS / Networks** core theory — 10 Qs
- **Behavioral / HR** (STAR-formatted) — 10 Qs

Each question keeps the Story → Question → Depth Answer format.

## Phase 3 — Company Prep Packs (deep dives)
Detail page for each target company: Google, Uber, Atlassian, Confluent, Databricks, Flipkart, Razorpay.

- Interview loop breakdown (rounds, what's tested)
- Top 20 most-asked questions tagged to that company
- Compensation bands (India ranges)
- Recent interview experiences (curated)
- "Start 30-day pack" → personalized roadmap

## Phase 4 — Mock Interview + Resume + Referrals
- **Mock Interview mode**: timed 45-min session, random Qs from chosen pack, self-rating + saved transcript
- **Resume Reviewer**: upload PDF → AI feedback (uses Lovable AI Gateway, free)
- **Referral Board**: community-posted referral openings, filter by company/role

## Phase 5 — Polish & Retention
- Push-style daily reminder banner
- 7-day / 30-day / 100-day streak celebrations
- Skill radar grows visibly each week
- Share-card generator ("I'm on a 30-day SkillStreak 🔥")

---

## Technical notes
- Stack stays TanStack Start + Tailwind + Framer Motion
- Server functions (`createServerFn`) for all reads/writes
- RLS on every table; `has_role()` SECURITY DEFINER for admin checks
- AI features via Lovable AI Gateway (Gemini, free tier)
- Existing UI stays — we're swapping the data layer underneath, not redesigning

---

**I'll start with Phase 1 right now** (Cloud + auth + DB migration of existing screens). That unlocks everything else. Approve to proceed and I'll ship Phase 1, then continue straight into Phase 2.