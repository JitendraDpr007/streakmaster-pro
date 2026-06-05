import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export function useNote(questionId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["note", user?.id, questionId],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("notes")
        .select("content")
        .eq("user_id", user!.id)
        .eq("question_id", questionId)
        .maybeSingle();
      return data?.content ?? "";
    },
  });
}

export function useSaveNote(questionId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id) return;
      await supabase
        .from("notes")
        .upsert(
          { user_id: user.id, question_id: questionId, content },
          { onConflict: "user_id,question_id" },
        );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["note", user?.id, questionId] });
    },
  });
}
