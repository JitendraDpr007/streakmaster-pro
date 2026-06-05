import { useState } from "react";
import type { Question } from "@/lib/skillstreak/data";
import { useNote, useSaveNote } from "@/lib/skillstreak/notes";
import { useUser } from "@/lib/skillstreak/store";
import { useAuth } from "@/lib/skillstreak/auth";

export function CodingSolver({ question }: { question: Question }) {
  const { user: authUser } = useAuth();
  const { user, recordSolve } = useUser();
  const { data: savedNote = "" } = useNote(question.id);
  const saveNote = useSaveNote(question.id);
  const [note, setNote] = useState("");
  const [dirty, setDirty] = useState(false);
  const solved = user.solved.includes(question.id);

  // hydrate from server note once
  if (!dirty && savedNote && note === "") {
    setNote(savedNote);
  }

  const persist = () => {
    if (!dirty) return;
    saveNote.mutate(note);
    setDirty(false);
  };

  const markSolved = () => {
    if (!solved) recordSolve(question.id, question.xp, 0);
  };

  return (
    <div className="space-y-4">
      <Block title="PROBLEM">
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/85">
          {question.problemStatement || question.question}
        </p>
      </Block>

      <div className="grid grid-cols-2 gap-2">
        {question.leetcodeUrl && (
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={markSolved}
            className="rounded-xl bg-[#FFA116] py-3 text-center text-[13px] font-bold text-black active:scale-[0.97]"
          >
            Solve on LeetCode →
          </a>
        )}
        {question.gfgUrl && (
          <a
            href={question.gfgUrl}
            target="_blank"
            rel="noreferrer"
            onClick={markSolved}
            className="rounded-xl bg-[#2F8D46] py-3 text-center text-[13px] font-bold text-white active:scale-[0.97]"
          >
            Solve on GFG →
          </a>
        )}
        {!question.leetcodeUrl && !question.gfgUrl && (
          <p className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 text-[12px] text-muted-foreground">
            No external practice link configured for this question yet.
          </p>
        )}
      </div>

      <Block title="📝 YOUR APPROACH & NOTES">
        {!authUser ? (
          <p className="text-[12px] text-muted-foreground">Sign in to save notes.</p>
        ) : (
          <>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setDirty(true);
              }}
              onBlur={persist}
              rows={8}
              placeholder={`Approach:\n- Use two pointers / hashmap / DP...\n\nComplexity:\n- Time: O(n)\n- Space: O(1)\n\nGotchas:\n- ...`}
              className="font-mono w-full rounded-xl border border-border bg-black/40 p-3 text-[12px] leading-relaxed outline-none focus:border-lime"
            />
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Autosaves on blur</span>
              {dirty && <span className="text-lime">unsaved…</span>}
            </div>
          </>
        )}
      </Block>

      {question.complexity && (
        <Block title="EXPECTED COMPLEXITY">
          <p className="font-mono text-[12px] text-cyan">{question.complexity}</p>
        </Block>
      )}

      {question.interviewTip && (
        <Block title="INTERVIEW TIP">
          <p className="text-[12px] leading-relaxed text-foreground/85">{question.interviewTip}</p>
        </Block>
      )}

      <button
        onClick={markSolved}
        disabled={solved}
        className="w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-50"
      >
        {solved ? `✓ Solved (+${question.xp} XP)` : `Mark solved (+${question.xp} XP)`}
      </button>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
