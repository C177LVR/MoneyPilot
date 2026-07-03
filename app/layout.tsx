import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moneypilot.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Money Pilot — Take control of your money",
    template: "%s · Money Pilot",
  },
  description:
    "Money Pilot is your personal financial coach, available 24/7. Learn to budget, crush debt, build savings, and invest with interactive lessons, calculators, and an AI coach.",
  keywords: [
    "personal finance",
    "budgeting",
    "financial literacy",
    "debt payoff",
    "savings",
    "investing",
    "financial coach",
  ],
  authors: [{ name: "Money Pilot" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Money Pilot — Take control of your money",
    description:
      "Your personal financial coach, available 24/7. Interactive lessons, calculators, and an AI coach that teaches you to master money.",
    siteName: "Money Pilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Money Pilot — Take control of your money",
    description:
      "Your personal financial coach, available 24/7. Learn budgeting, debt payoff, saving, and investing.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
