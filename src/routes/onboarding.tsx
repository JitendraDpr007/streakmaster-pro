import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANIES } from "@/lib/skillstreak/data";
import { useUser } from "@/lib/skillstreak/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome · SkillStreak" }] }),
  component: Onboarding,
});

const TARGETS = [
  { id: "faang", icon: "🏆", title: "FAANG / Top Tier", desc: "Google, Meta, Amazon" },
  { id: "unicorn", icon: "🚀", title: "Indian Unicorns", desc: "Flipkart, Razorpay, CRED" },
  { id: "startup", icon: "💼", title: "Product Startups", desc: "High growth, lean teams" },
  { id: "global", icon: "🌏", title: "Global Mid-size", desc: "Atlassian, Confluent, Uber" },
];

const LEVELS = [
  { id: "fresher", icon: "🌱", title: "Fresher", desc: "0–1 years" },
  { id: "mid", icon: "⚡", title: "Mid Level", desc: "2–4 years" },
  { id: "senior", icon: "🔥", title: "Senior", desc: "5+ years" },
];

const GOALS = [
  { id: 1, icon: "☕", title: "Casual", desc: "1 challenge/day" },
  { id: 3, icon: "🎯", title: "Serious", desc: "3 challenges/day" },
  { id: 5, icon: "💪", title: "Beast Mode", desc: "5 challenges/day" },
];

function Onboarding() {
  const { patch } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [level, setLevel] = useState("");
  const [companies, setCompanies] = useState<string[]>([]);
  const [goal, setGoal] = useState<number | null>(null);

  const finish = () => {
    patch({
      onboarded: true,
      name: name || "Coder",
      target,
      level,
      goalCompanies: companies,
      dailyGoal: goal ?? 3,
    });
    navigate({ to: "/" });
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canNext =
    (step === 0 && !!target) ||
    (step === 1 && !!level) ||
    (step === 2 && companies.length > 0) ||
    (step === 3 && goal != null) ||
    (step === 4 && name.trim().length > 1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-100" />

      <div className="relative px-5 pt-6">
        <div className="font-display text-[15px] font-extrabold">
          <span>SKILL</span>
          <span className="text-lime">STREAK</span>
        </div>

        {/* progress dots */}
        <div className="mt-5 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? "bg-lime" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-6 px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <Step title="What's your target?" subtitle="We'll tailor your prep around it.">
                <div className="grid grid-cols-1 gap-2.5">
                  {TARGETS.map((t) => (
                    <Card
                      key={t.id}
                      active={target === t.title}
                      onClick={() => setTarget(t.title)}
                      icon={t.icon}
                      title={t.title}
                      desc={t.desc}
                    />
                  ))}
                </div>
              </Step>
            )}

            {step === 1 && (
              <Step title="Your current level?" subtitle="Be honest. We'll calibrate difficulty.">
                <div className="grid grid-cols-1 gap-2.5">
                  {LEVELS.map((l) => (
                    <Card
                      key={l.id}
                      active={level === l.title}
                      onClick={() => setLevel(l.title)}
                      icon={l.icon}
                      title={l.title}
                      desc={l.desc}
                    />
                  ))}
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step title="Pick your dream companies" subtitle="Select all that excite you.">
                <div className="flex flex-wrap gap-2">
                  {COMPANIES.map((c) => {
                    const active = companies.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() =>
                          setCompanies((arr) =>
                            arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c],
                          )
                        }
                        className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition active:scale-95 ${
                          active
                            ? "border-lime bg-lime text-primary-foreground"
                            : "border-border bg-white/[0.03] text-foreground"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </Step>
            )}

            {step === 3 && (
              <Step title="Set your daily goal" subtitle="You can change this anytime.">
                <div className="grid grid-cols-1 gap-2.5">
                  {GOALS.map((g) => (
                    <Card
                      key={g.id}
                      active={goal === g.id}
                      onClick={() => setGoal(g.id)}
                      icon={g.icon}
                      title={g.title}
                      desc={g.desc}
                    />
                  ))}
                </div>
              </Step>
            )}

            {step === 4 && (
              <Step title="What should we call you?" subtitle="One last thing.">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="font-display w-full rounded-2xl border border-border bg-card px-4 py-4 text-[20px] font-bold outline-none transition focus:border-lime focus:lime-glow"
                />
                <p className="mt-4 text-[12px] text-muted-foreground">
                  100% free. Forever. No paywalls. No ads. Ever.
                </p>
              </Step>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 px-5 pb-5 pt-3"
        style={{ background: "linear-gradient(to top, #08080D 70%, transparent)" }}
      >
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={back}
              className="rounded-xl border border-border bg-card px-5 py-3.5 text-[14px] font-bold text-muted-foreground"
            >
              ←
            </button>
          )}
          <button
            onClick={step === 4 ? finish : next}
            disabled={!canNext}
            className="flex-1 rounded-xl bg-lime py-3.5 text-[14px] font-extrabold text-primary-foreground transition active:scale-[0.98] disabled:opacity-30"
          >
            {step === 4 ? "Start streaking 🔥" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-32">
      <h1 className="text-[28px] leading-[1.05]">{title}</h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
        active
          ? "border-lime bg-[oklch(0.92_0.22_125/0.08)] lime-glow"
          : "border-border bg-card hover:border-white/15"
      }`}
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl">{icon}</div>
      <div className="flex-1">
        <p className="text-[15px] font-bold">{title}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
      <div
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          active ? "border-lime bg-lime" : "border-border"
        }`}
      >
        {active && <span className="text-[10px] font-extrabold text-primary-foreground">✓</span>}
      </div>
    </button>
  );
}
