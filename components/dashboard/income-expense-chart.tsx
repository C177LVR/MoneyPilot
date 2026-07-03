"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Point = { label: string; income: number; expenses: number };

const tick = "#94a3b8";
const grid = "rgba(148,163,184,0.15)";

export function IncomeExpenseChart({ series }: { series: Point[] }) {
  const data = {
    labels: series.map((s) => s.label),
    datasets: [
      {
        label: "Income",
        data: series.map((s) => s.income),
        backgroundColor: "#10b981",
        borderRadius: 6,
        maxBarThickness: 22,
      },
      {
        label: "Expenses",
        data: series.map((s) => s.expenses),
        backgroundColor: "#f43f5e",
        borderRadius: 6,
        maxBarThickness: 22,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: { color: tick, boxWidth: 12, boxHeight: 12, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (c: { dataset: { label?: string }; parsed: { y: number } }) =>
            `${c.dataset.label}: $${c.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: tick } },
      y: {
        grid: { color: grid },
        ticks: {
          color: tick,
          callback: (v: string | number) => `$${Number(v).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
