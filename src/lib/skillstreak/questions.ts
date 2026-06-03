import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Question } from "./data";

interface DbQuestion {
  id: string;
  slug: string | null;
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
}

export function dbToQuestion(r: DbQuestion): Question {
  return {
    id: r.id,
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
      return (data as DbQuestion[]).map(dbToQuestion);
    },
  });
}
