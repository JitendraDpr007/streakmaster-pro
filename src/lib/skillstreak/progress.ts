import { QUESTIONS, type Category } from "./data";

export interface SkillStat {
  label: string;
  solved: number;
  total: number;
  value: number; // 0..1
}

const SKILL_BUCKETS: { label: string; matches: (q: (typeof QUESTIONS)[number]) => boolean }[] = [
  { label: "DSA", matches: (q) => q.category === "DSA" },
  { label: "SQL", matches: (q) => q.category === "SQL" },
  { label: "System Design", matches: (q) => q.category === "System Design" },
  { label: "OS", matches: (q) => /os|operating|process|thread/i.test(q.subcategory) },
  { label: "Behavioral", matches: (q) => q.category === "Behavioral" },
  { label: "Resume", matches: (q) => q.category === "Resume Tips" },
];

export function skillStats(solvedIds: string[]): SkillStat[] {
  const solved = new Set(solvedIds);
  return SKILL_BUCKETS.map((b) => {
    const matched = QUESTIONS.filter(b.matches);
    const total = Math.max(matched.length, 1);
    const done = matched.filter((q) => solved.has(q.id)).length;
    return {
      label: b.label,
      solved: done,
      total: matched.length,
      // floor with a tiny baseline so the radar still has shape early on
      value: Math.min(1, Math.max(0.08, done / total)),
    };
  });
}

export function categoryProgress(solvedIds: string[]) {
  const solved = new Set(solvedIds);
  const groups: Record<Category, { done: number; total: number }> = {
    DSA: { done: 0, total: 0 },
    SQL: { done: 0, total: 0 },
    "System Design": { done: 0, total: 0 },
    Behavioral: { done: 0, total: 0 },
    "Resume Tips": { done: 0, total: 0 },
  };
  for (const q of QUESTIONS) {
    groups[q.category].total += 1;
    if (solved.has(q.id)) groups[q.category].done += 1;
  }
  return groups;
}

// Map roadmap node ids (from data ROADMAP) to fuzzy subcategory matches
const ROADMAP_MATCH: Record<string, RegExp> = {
  arrays: /array|sliding|two pointer/i,
  strings: /string/i,
  hashing: /hash|map|set/i,
  trees: /tree|bst|trie/i,
  graphs: /graph|bfs|dfs/i,
  dp: /dynamic|dp|memoi/i,
  advanced: /segment|fenwick|advanced/i,
};

export function roadmapProgress(solvedIds: string[]) {
  const solved = new Set(solvedIds);
  const out: Record<string, { done: number; total: number; pct: number }> = {};
  for (const [id, re] of Object.entries(ROADMAP_MATCH)) {
    const matched = QUESTIONS.filter((q) => q.category === "DSA" && re.test(q.subcategory));
    const total = matched.length;
    const done = matched.filter((q) => solved.has(q.id)).length;
    // give a target of at least 5 per topic so progress feels earned
    const target = Math.max(total, 5);
    out[id] = { done, total, pct: Math.min(100, Math.round((done / target) * 100)) };
  }
  return out;
}
