CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('offering','seeking')),
  note text NOT NULL,
  contact text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrals are viewable by authenticated"
  ON public.referrals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users insert own referral"
  ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own referral"
  ON public.referrals FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users delete own referral"
  ON public.referrals FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tg_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();