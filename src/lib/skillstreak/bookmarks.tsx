import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export interface Bookmark {
  id: string;
  question_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export function useBookmarks() {
  const { user: authUser } = useAuth();
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!authUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select("id, question_id, note, created_at, updated_at")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false });
    setItems((data as Bookmark[]) ?? []);
    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    load();
  }, [load]);

  const isBookmarked = (questionId: string) =>
    items.some((b) => b.question_id === questionId);

  const toggle = async (questionId: string) => {
    if (!authUser) return;
    const existing = items.find((b) => b.question_id === questionId);
    if (existing) {
      setItems((arr) => arr.filter((b) => b.id !== existing.id));
      await supabase.from("bookmarks").delete().eq("id", existing.id);
    } else {
      const { data } = await supabase
        .from("bookmarks")
        .insert({ user_id: authUser.id, question_id: questionId, note: "" })
        .select()
        .single();
      if (data) setItems((arr) => [data as Bookmark, ...arr]);
    }
  };

  const setNote = async (questionId: string, note: string) => {
    if (!authUser) return;
    const existing = items.find((b) => b.question_id === questionId);
    if (existing) {
      setItems((arr) =>
        arr.map((b) => (b.id === existing.id ? { ...b, note } : b)),
      );
      await supabase.from("bookmarks").update({ note }).eq("id", existing.id);
    } else {
      const { data } = await supabase
        .from("bookmarks")
        .insert({ user_id: authUser.id, question_id: questionId, note })
        .select()
        .single();
      if (data) setItems((arr) => [data as Bookmark, ...arr]);
    }
  };

  return { items, loading, isBookmarked, toggle, setNote, refresh: load };
}
