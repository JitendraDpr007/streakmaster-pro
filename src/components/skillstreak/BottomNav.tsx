import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

const TABS = [
  { to: "/", label: "Home", icon: "⚡" },
  { to: "/arena", label: "Arena", icon: "🎯" },
  { to: "/roadmap", label: "Roadmap", icon: "🗺️" },
  { to: "/leaderboard", label: "Ranks", icon: "🏆" },
  { to: "/profile", label: "Profile", icon: "👤" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 px-3 pb-3 pt-2"
      style={{
        background:
          "linear-gradient(to top, rgba(8,8,13,0.95) 60%, rgba(8,8,13,0))",
      }}
    >
      <div className="glass flex items-center justify-between rounded-2xl px-2 py-2">
        {TABS.map((t) => {
          const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5 active:scale-95 transition-transform"
            >
              {active && (
                <motion.div
                  layoutId="navpill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(205,255,71,0.10)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative text-base">{t.icon}</span>
              <span
                className={`relative text-[10px] font-medium tracking-wide ${
                  active ? "text-lime" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
