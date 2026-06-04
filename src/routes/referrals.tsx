import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/skillstreak/auth";
import { useUser } from "@/lib/skillstreak/store";
import { COMPANIES } from "@/lib/skillstreak/data";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Referrals · SkillStreak" },
      {
        name: "description",
        content: "Get referred. Refer others. The community board for top product companies.",
      },
    ],
  }),
  component: ReferralsPage,
});

interface Referral {
  id: string;
  user_id: string;
  author_name: string;
  company: string;
  role: string;
  kind: "offering" | "seeking";
  note: string;
  contact: string;
  created_at: string;
}

type Filter = "all" | "offering" | "seeking";

function ReferralsPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const [items, setItems] = useState<Referral[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("referrals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setItems((data as Referral[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((r) => filter === "all" || r.kind === filter);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("referrals").delete().eq("id", id);
    load();
  };

  return (
    <div className="px-5 pb-24 pt-5">
      <button
        onClick={() => navigate({ to: "/" })}
        className="mb-3 text-[11px] text-muted-foreground active:scale-95"
      >
        ← Home
      </button>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-lime">Community Board</div>
          <h1 className="font-syne text-2xl">Referrals</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Get referred. Refer others. No middlemen.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-lime px-3 py-2 text-[12px] font-bold text-primary-foreground active:scale-95"
        >
          + Post
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        {(["all", "offering", "seeking"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-[11px] capitalize transition ${
              filter === f
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/10 text-muted-foreground"
            }`}
          >
            {f === "offering" ? "🙌 Offering" : f === "seeking" ? "🙏 Seeking" : "All"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="py-10 text-center text-xs text-muted-foreground">Loading…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-xs text-muted-foreground">
            No posts yet. Be the first.
          </div>
        )}
        {filtered.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      r.kind === "offering"
                        ? "bg-lime/15 text-lime"
                        : "bg-cyan/15 text-cyan"
                    }`}
                  >
                    {r.kind === "offering" ? "🙌 Offering" : "🙏 Seeking"}
                  </span>
                  <span className="text-[13px] font-bold">{r.company}</span>
                  <span className="text-[11px] text-muted-foreground">· {r.role}</span>
                </div>
                <p className="mt-2 text-[12px] leading-snug text-foreground/85">{r.note}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{r.author_name}</span>
                  <span>·</span>
                  <a
                    href={r.contact.startsWith("http") ? r.contact : `mailto:${r.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime underline-offset-2 hover:underline"
                  >
                    {r.contact}
                  </a>
                  <span>·</span>
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {authUser?.id === r.user_id && (
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-[10px] text-red-400 active:scale-95"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && authUser && (
          <PostForm
            authorName={user.name || authUser.email?.split("@")[0] || "Coder"}
            userId={authUser.id}
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostForm({
  userId,
  authorName,
  onClose,
  onCreated,
}: {
  userId: string;
  authorName: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [kind, setKind] = useState<"offering" | "seeking">("offering");
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!role.trim() || !note.trim() || !contact.trim()) {
      setErr("Fill in role, note and contact.");
      return;
    }
    setSaving(true);
    setErr(null);
    const { error } = await supabase.from("referrals").insert({
      user_id: userId,
      author_name: authorName,
      company,
      role: role.trim(),
      kind,
      note: note.trim(),
      contact: contact.trim(),
    });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onCreated();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0E0E14] p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-syne text-lg">New referral post</h2>
          <button onClick={onClose} className="text-muted-foreground">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setKind("offering")}
              className={`rounded-xl border py-2.5 text-[12px] font-semibold ${
                kind === "offering"
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-white/10 text-muted-foreground"
              }`}
            >
              🙌 I can refer
            </button>
            <button
              onClick={() => setKind("seeking")}
              className={`rounded-xl border py-2.5 text-[12px] font-semibold ${
                kind === "seeking"
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-white/10 text-muted-foreground"
              }`}
            >
              🙏 I need a referral
            </button>
          </div>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-lime"
          >
            {COMPANIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (e.g. SDE-2 Backend)"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-lime"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder={
              kind === "offering"
                ? "What can you offer? e.g. 'SDE-2 at Razorpay Bangalore. Will refer for backend roles. Send me your resume + role.'"
                : "What are you looking for? e.g. '3 YoE backend. Targeting Razorpay/Flipkart. Have OAs cleared.'"
            }
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-[13px] outline-none focus:border-lime"
          />

          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact (LinkedIn URL or email)"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-lime"
          />

          {err && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] text-red-400">
              {err}
            </div>
          )}

          <button
            onClick={submit}
            disabled={saving}
            className="w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-50"
          >
            {saving ? "Posting…" : "Post"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
