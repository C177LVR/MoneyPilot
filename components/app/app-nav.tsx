"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  TrendingDown,
  Target,
  CalendarClock,
  PieChart,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: PieChart },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/debts", label: "Debts", icon: TrendingDown },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/bills", label: "Bills", icon: CalendarClock },
  { href: "/calculators", label: "Calculators", icon: Calculator },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:w-56 lg:shrink-0">
      <ul className="flex gap-1 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gradient-brand text-white shadow-lg shadow-brand-600/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
