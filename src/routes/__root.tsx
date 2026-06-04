import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { UserProvider } from "@/lib/skillstreak/store";
import { AuthProvider, useAuth } from "@/lib/skillstreak/auth";
import { BottomNav } from "@/components/skillstreak/BottomNav";
import { StreakCelebration } from "@/components/skillstreak/StreakCelebration";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist. Get back to the grind.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-lime px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-xl bg-lime px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#08080D" },
      { title: "SkillStreak — The last prep app you'll ever need" },
      {
        name: "description",
        content:
          "Daily DSA, SQL, and System Design challenges built for Indian developers cracking Google, Uber, Razorpay & more.",
      },
      { property: "og:title", content: "SkillStreak — The last prep app you'll ever need" },
      { name: "twitter:title", content: "SkillStreak — The last prep app you'll ever need" },
      { name: "description", content: "SkillStreak helps Indian developers master product-based company interviews with daily challenges and streaks." },
      { property: "og:description", content: "SkillStreak helps Indian developers master product-based company interviews with daily challenges and streaks." },
      { name: "twitter:description", content: "SkillStreak helps Indian developers master product-based company interviews with daily challenges and streaks." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/xKjoqLipQbYwY9zgioFMhbsrrMI3/social-images/social-1780545103920-IMG_3408.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/xKjoqLipQbYwY9zgioFMhbsrrMI3/social-images/social-1780545103920-IMG_3408.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const PUBLIC_PATHS = new Set(["/auth"]);

function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // invalidate cached queries when auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loading) return;
    if (!session && !PUBLIC_PATHS.has(pathname)) {
      navigate({ to: "/auth" });
    }
  }, [loading, session, pathname, navigate]);

  if (loading) return null;
  if (!session && !PUBLIC_PATHS.has(pathname)) return null;
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <div className="min-h-screen w-full" style={{ background: "#08080D" }}>
            <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#08080D] pb-24">
              <AuthGate>
                <Outlet />
              </AuthGate>
            </div>
            <BottomNav />
            <StreakCelebration />
          </div>

        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
