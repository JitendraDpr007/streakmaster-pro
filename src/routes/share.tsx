import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/skillstreak/store";
import { levelFor } from "@/lib/skillstreak/data";

export const Route = createFileRoute("/share")({
  head: () => ({ meta: [{ title: "Share Card · SkillStreak" }] }),
  component: SharePage,
});

const TEMPLATES = [
  { id: "streak", label: "🔥 Streak", bg: ["#0F0F17", "#1A1A2E"], accent: "#CDFF47" },
  { id: "rank", label: "🏆 Rank", bg: ["#0F0F17", "#2E1A2E"], accent: "#FF6B9D" },
  { id: "mastery", label: "⚡ XP", bg: ["#0F0F17", "#1A2E2E"], accent: "#47F3FF" },
];

function SharePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const lvl = levelFor(user.xp);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = 1080;
    const H = 1080;
    c.width = W;
    c.height = H;

    // bg gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, tpl.bg[0]);
    g.addColorStop(1, tpl.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // grid dots
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let x = 0; x < W; x += 40) {
      for (let y = 0; y < H; y += 40) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // brand
    ctx.font = "bold 36px ui-sans-serif, system-ui";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("SKILL", 80, 110);
    ctx.fillStyle = tpl.accent;
    ctx.fillText("STREAK", 80 + ctx.measureText("SKILL").width, 110);

    // tagline
    ctx.font = "500 24px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("The last interview prep app you'll need.", 80, 150);

    // main metric per template
    let bigLabel = "";
    let bigValue = "";
    let sub = "";
    if (tpl.id === "streak") {
      bigLabel = "DAY STREAK";
      bigValue = String(user.streak);
      sub = `🔥 ${user.longestStreak} day best · ${user.solved.length} solved`;
    } else if (tpl.id === "rank") {
      bigLabel = "CURRENT LEVEL";
      bigValue = lvl.name;
      sub = `${user.xp.toLocaleString()} XP · Top ${Math.max(5, 100 - Math.min(95, Math.round(user.xp / 200)))}%`;
    } else {
      bigLabel = "TOTAL XP";
      bigValue = user.xp.toLocaleString();
      sub = `${user.solved.length} problems · ${user.streak}-day streak`;
    }

    ctx.font = "bold 28px ui-sans-serif, system-ui";
    ctx.fillStyle = tpl.accent;
    ctx.fillText(bigLabel, 80, 460);

    ctx.font = "900 220px ui-sans-serif, system-ui";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(bigValue, 80, 680);

    ctx.font = "600 30px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(sub, 80, 740);

    // name card
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, 80, 820, W - 160, 140, 24);
    ctx.fill();
    ctx.font = "bold 40px ui-sans-serif, system-ui";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(user.name, 120, 880);
    ctx.font = "500 24px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(`Targeting ${user.goalCompanies.slice(0, 3).join(", ")}`, 120, 920);

    // accent dot
    ctx.beginPath();
    ctx.arc(W - 160, 880, 28, 0, Math.PI * 2);
    ctx.fillStyle = tpl.accent;
    ctx.fill();

    // footer
    ctx.font = "500 22px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText("skillstreak.app", 80, 1020);
  }, [user, tpl]);

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillstreak-${tpl.id}-${user.streak}d.png`;
    a.click();
  };

  const shareNative = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
    if (!blob) return;
    const file = new File([blob], "skillstreak.png", { type: "image/png" });
    const text = `${user.streak}-day SkillStreak. ${user.xp.toLocaleString()} XP. Cracking ${user.goalCompanies[0] ?? "FAANG"}. 🔥`;
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], text, title: "My SkillStreak" });
    } else {
      download();
    }
  };

  return (
    <div className="px-5 pb-24 pt-5">
      <button
        onClick={() => navigate({ to: "/profile" })}
        className="mb-3 text-[11px] text-muted-foreground active:scale-95"
      >
        ← Back
      </button>
      <div className="text-[10px] uppercase tracking-[0.2em] text-lime">Flex Card</div>
      <h1 className="font-syne text-2xl">Share your streak</h1>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Auto-generated 1080×1080. Drop it on LinkedIn, Twitter, or WhatsApp status.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTpl(t)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
              tpl.id === t.id
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/10 text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 overflow-hidden rounded-3xl border border-white/10"
      >
        <canvas ref={canvasRef} className="block aspect-square w-full" />
      </motion.div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={download}
          className="rounded-2xl border border-white/10 bg-card py-3.5 text-[13px] font-bold active:scale-[0.98]"
        >
          ⬇ Download PNG
        </button>
        <button
          onClick={shareNative}
          className="rounded-2xl bg-lime py-3.5 text-[13px] font-extrabold text-primary-foreground active:scale-[0.98]"
        >
          🚀 Share
        </button>
      </div>

      <p className="mt-3 text-center text-[10px] text-muted-foreground">
        Posting your streak = free marketing for the next dev that needs this app. 🙏
      </p>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
