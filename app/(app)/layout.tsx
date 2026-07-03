import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppNav } from "@/components/app/app-nav";
import { LogoMark } from "@/components/brand/logo-mark";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, appUser } = await getCurrentUser();
  if (!authUser) redirect("/login");
  if (!appUser?.profile?.onboardedAt) redirect("/onboarding");

  const firstName = (appUser.name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-display font-bold"
          >
            <LogoMark size={32} priority />
            Money Pilot
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Hi, {firstName}
            </span>
            <ThemeToggle />
            <form action={signOut}>
              <button className="h-10 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:flex lg:gap-6">
        <AppNav />
        <main className="min-w-0 flex-1 py-2">{children}</main>
      </div>
    </div>
  );
}
