"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

type Slice = { category: string; amount: number };

const PALETTE = [
  "#2563eb", "#10b981", "#f97316", "#8b5cf6", "#ec4899",
  "#14b8a6", "#f59e0b", "#6366f1", "#ef4444", "#0ea5e9",
];

const tick = "#94a3b8";

export function CategoryChart({ slices }: { slices: Slice[] }) {
  // Collapse a long tail into "Other" so the doughnut stays readable.
  const top = slices.slice(0, 8);
  const rest = slices.slice(8);
  const restTotal = rest.reduce((s, x) => s + x.amount, 0);
  const display = restTotal > 0 ? [...top, { category: "Other", amount: restTotal }] : top;
  const total = display.reduce((s, x) => s + x.amount, 0);

  const data = {
    labels: display.map((s) => s.category),
    datasets: [
      {
        data: display.map((s) => s.amount),
        backgroundColor: display.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: tick,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (c: { label: string; parsed: number }) => {
            const pct = total > 0 ? Math.round((c.parsed / total) * 100) : 0;
            return `${c.label}: ${formatCurrency(c.parsed)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}
