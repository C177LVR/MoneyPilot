"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

type Slice = { name: string; planned: number; color: string };

const tick = "#94a3b8";

export function BudgetPieChart({ slices }: { slices: Slice[] }) {
  const nonZero = slices.filter((s) => s.planned > 0);
  const total = nonZero.reduce((s, x) => s + x.planned, 0);

  const data = {
    labels: nonZero.map((s) => s.name),
    datasets: [
      {
        data: nonZero.map((s) => s.planned),
        backgroundColor: nonZero.map((s) => s.color),
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
