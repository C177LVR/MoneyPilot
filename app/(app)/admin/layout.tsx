import Link from "next/link";
import { BarChart3, Users, Newspaper, Bell } from "lucide-react";
import { requireAdminUserId } from "@/lib/action-helpers";

const TABS = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUserId();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, publish articles, and view platform analytics.
        </p>
      </div>
      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-border bg-muted p-1">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
