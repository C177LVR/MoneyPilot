import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireAdminUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { setUserRole } from "@/app/actions/admin";
import { Card, Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin — Users",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const adminId = await requireAdminUserId();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: { select: { onboardedAt: true, level: true, xp: true } } },
  });

  return (
    <Card className="p-2 sm:p-3">
      <h2 className="px-3 py-2 font-display text-lg font-semibold">
        Users ({users.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Name / Email</th>
              <th className="px-3 py-2 font-medium">Onboarded</th>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const isSelf = u.id === adminId;
              const nextRole = u.role === "ADMIN" ? "USER" : "ADMIN";
              return (
                <tr key={u.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{u.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    {u.profile?.onboardedAt ? (
                      <Badge className="border-mint-200 bg-mint-50 text-mint-700 dark:border-mint-900/40 dark:bg-mint-950/30 dark:text-mint-300">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-3 py-3">{u.profile?.level ?? 1}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        u.role === "ADMIN" ? "text-brand-600" : "text-muted-foreground"
                      )}
                    >
                      {u.role === "ADMIN" && <ShieldCheck className="h-3.5 w-3.5" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {u.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <form action={setUserRole}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="role" value={nextRole} />
                      <button
                        type="submit"
                        disabled={isSelf && nextRole === "USER"}
                        title={
                          isSelf && nextRole === "USER"
                            ? "You can't remove your own admin access"
                            : undefined
                        }
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Make {nextRole === "ADMIN" ? "Admin" : "User"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
