import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import type { Question } from "@/lib/skillstreak/data";
import { askCoach } from "@/lib/skillstreak/coach.functions";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function AiCoachDrawer({
  question,
  phase,
  onClose,
}: {
  question: Question;
  phase: string;
  onClose: () => void;
}) {
  const ask = useServerFn(askCoach);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Let's tackle **${question.title}** together. We're on the **${phase.toUpperCase()}** phase. Tell me your initial approach — what are the core requirements you'd clarify first?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({
        data: {
          questionTitle: question.title,
          category: question.category,
          history: next.slice(-10),
          userMessage: text,
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Coach hit an error. Try again." },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[92vh] w-full max-w-[430px] flex-col rounded-t-3xl border-t border-cyan/30 bg-[#0A0A11]"
      >
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-cyan">AI Interview Coach</p>
            <p className="text-sm font-bold">{question.title}</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-muted-foreground"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-lime text-primary-foreground"
                    : "border border-cyan/20 bg-cyan/5 text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-cyan/20 bg-cyan/5 px-3.5 py-2.5 text-[13px] text-muted-foreground">
                Coach is thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Describe your approach… (Enter to send)"
              className="flex-1 rounded-xl border border-white/10 bg-black/40 p-2.5 text-[13px] outline-none focus:border-cyan"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              className="rounded-xl bg-cyan px-4 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
