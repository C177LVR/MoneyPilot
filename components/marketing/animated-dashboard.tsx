"use client";

import * as React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { AnimatedCounter } from "./animated-counter";
import { HealthRing } from "./health-ring";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const netWorth = [18200, 21400, 24100, 26800, 31200, 35600, 41800];

export function AnimatedDashboard() {
  const data = {
    labels: months,
    datasets: [
      {
        data: netWorth,
        borderColor: "#10b981",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#10b981",
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return "rgba(16,185,129,0.15)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(16,185,129,0.35)");
          g.addColorStop(1, "rgba(16,185,129,0)");
          return g;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (c: { parsed: { y: number } }) =>
            `$${c.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
      y: { display: false },
    },
    animation: { duration: 1600 },
  } as const;

  return (
    <div className="relative">
      {/* Floating stat cards */}
      <motion.div
        className="absolute -left-4 top-10 z-20 hidden sm:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlassCard className="flex items-center gap-3 p-3.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-500/15 text-mint-600">
            <PiggyBank className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Savings rate</p>
            <p className="font-display text-lg font-bold text-mint-600">
              <AnimatedCounter value={24} suffix="%" />
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        className="absolute -right-4 bottom-24 z-20 hidden sm:block"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <GlassCard className="flex items-center gap-3 p-3.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-600">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Investments</p>
            <p className="font-display text-lg font-bold text-brand-600">
              <AnimatedCounter value={12480} prefix="$" />
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main dashboard panel */}
      <GlassCard className="relative z-10 overflow-hidden p-5 shadow-glass-lg sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Net worth</p>
            <p className="font-display text-3xl font-bold">
              <AnimatedCounter value={41800} prefix="$" />
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-mint-600">
              <ArrowUpRight className="h-4 w-4" /> +18.6% this year
            </p>
          </div>
          <HealthRing score={82} size={112} stroke={10} />
        </div>

        <div className="h-40">
          <Line data={data} options={options} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            {
              label: "Income",
              value: 6200,
              icon: TrendingUp,
              tone: "text-mint-600 bg-mint-500/10",
            },
            {
              label: "Expenses",
              value: 4710,
              icon: CreditCard,
              tone: "text-accent-500 bg-accent-500/10",
            },
            {
              label: "Saved",
              value: 1490,
              icon: PiggyBank,
              tone: "text-brand-600 bg-brand-500/10",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-3">
              <span
                className={`mb-2 grid h-8 w-8 place-items-center rounded-lg ${s.tone}`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display text-base font-bold">
                <AnimatedCounter value={s.value} prefix="$" />
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
