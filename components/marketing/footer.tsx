import Link from "next/link";
import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";

const columns = [
  {
    title: "Learn",
    links: [
      "Budgeting",
      "Debt payoff",
      "Investing",
      "Retirement",
      "Credit scores",
    ],
  },
  {
    title: "Tools",
    links: [
      "Budget builder",
      "Calculators",
      "Goal tracker",
      "Net worth tracker",
      "AI coach",
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Disclosures", "Cookies"],
  },
];

const socials = [Twitter, Instagram, Youtube, Linkedin];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-bold"
            >
              <LogoMark size={36} />
              Money Pilot
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your personal financial coach, available 24/7. Learn to master
              money — regardless of income.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href={l === "Calculators" ? "/calculators" : "#"}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Money Pilot. All rights reserved.</p>
          <p className="max-w-md text-center text-xs sm:text-right">
            Educational content only — not financial, tax, or investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
