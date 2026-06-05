
-- Extend questions table
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'mcq',
  ADD COLUMN IF NOT EXISTS problem_statement text,
  ADD COLUMN IF NOT EXISTS leetcode_url text,
  ADD COLUMN IF NOT EXISTS gfg_url text,
  ADD COLUMN IF NOT EXISTS sql_schema text,
  ADD COLUMN IF NOT EXISTS sql_seed text,
  ADD COLUMN IF NOT EXISTS sql_expected jsonb,
  ADD COLUMN IF NOT EXISTS requirements jsonb,
  ADD COLUMN IF NOT EXISTS hld jsonb,
  ADD COLUMN IF NOT EXISTS lld jsonb,
  ADD COLUMN IF NOT EXISTS tradeoffs jsonb;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_type_check
  CHECK (type IN ('mcq','coding','sql','system_design'));

-- Notes table
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notes" ON public.notes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own notes" ON public.notes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own notes" ON public.notes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notes" ON public.notes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER notes_set_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
