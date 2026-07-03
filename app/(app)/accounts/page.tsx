import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import {
  AccountManager,
  type AccountView,
} from "@/components/finances/account-manager";

export const metadata: Metadata = {
  title: "Accounts",
  robots: { index: false, follow: false },
};

export default async function AccountsPage() {
  const userId = await requireUserId();
  const accounts = await prisma.financialAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const view: AccountView[] = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    balance: Number(a.balance),
    creditLimit: a.creditLimit != null ? Number(a.creditLimit) : null,
  }));

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="Track balances across checking, savings, investments, credit cards, and loans."
      />
      <AccountManager accounts={view} />
    </div>
  );
}
