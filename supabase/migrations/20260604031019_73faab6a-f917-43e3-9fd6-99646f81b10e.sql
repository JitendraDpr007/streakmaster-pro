
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own bookmarks" ON public.bookmarks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookmarks" ON public.bookmarks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bookmarks" ON public.bookmarks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks" ON public.bookmarks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER bookmarks_set_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX bookmarks_user_idx ON public.bookmarks(user_id, created_at DESC);
