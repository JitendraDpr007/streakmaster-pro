import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DesignSection, Question, QuestionType } from "./data";

interface DbQuestion {
  id: string;
  slug: string | null;
  type: string | null;
  category: string;
  subcategory: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  xp: number;
  companies: string[];
  icon: string | null;
  story: string;
  question: string;
  options: unknown;
  correct_index: number;
  explanation: string;
  why_others_wrong: string | null;
  complexity: string | null;
  interview_tip: string | null;
  followup: string | null;
  similar_questions: string[] | null;
  problem_statement: string | null;
  leetcode_url: string | null;
  gfg_url: string | null;
  sql_schema: string | null;
  sql_seed: string | null;
  sql_expected: unknown;
  requirements: unknown;
  hld: unknown;
  lld: unknown;
  tradeoffs: unknown;
}

function asSections(v: unknown): DesignSection[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v as DesignSection[];
}

export function dbToQuestion(r: DbQuestion): Question {
  return {
    id: r.id,
    type: ((r.type as QuestionType) ?? "mcq"),
    category: r.category as Question["category"],
    subcategory: r.subcategory,
    title: r.title,
    difficulty: r.difficulty,
    xp: r.xp,
    companies: r.companies ?? [],
    icon: r.icon ?? "🧠",
    story: r.story,
    question: r.question,
    options: Array.isArray(r.options) ? (r.options as string[]) : [],
    correctIndex: r.correct_index,
    explanation: r.explanation,
    whyOthersWrong: r.why_others_wrong ?? "",
    complexity: r.complexity ?? undefined,
    interviewTip: r.interview_tip ?? "",
    followup: r.followup ?? "",
    similar: r.similar_questions ?? undefined,
    problemStatement: r.problem_statement ?? undefined,
    leetcodeUrl: r.leetcode_url ?? undefined,
    gfgUrl: r.gfg_url ?? undefined,
    sqlSchema: r.sql_schema ?? undefined,
    sqlSeed: r.sql_seed ?? undefined,
    sqlExpected: (r.sql_expected as Question["sqlExpected"]) ?? undefined,
    requirements: asSections(r.requirements),
    hld: asSections(r.hld),
    lld: asSections(r.lld),
    tradeoffs: asSections(r.tradeoffs),
  };
}

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as DbQuestion[]).map(dbToQuestion);
    },
  });
}
