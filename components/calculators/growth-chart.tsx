"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Point = { label: string; value: number; value2?: number };

const tick = "#94a3b8";
const grid = "rgba(148,163,184,0.15)";

export function GrowthChart({
  series,
  seriesLabels = ["Value"],
}: {
  series: Point[];
  seriesLabels?: [string, string?];
}) {
  const hasSecond = series.some((p) => p.value2 !== undefined);

  const datasets = [
    {
      label: seriesLabels[0],
      data: series.map((p) => p.value),
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.12)",
      borderWidth: 3,
      tension: 0.35,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
    },
    ...(hasSecond
      ? [
          {
            label: seriesLabels[1] ?? "Value 2",
            data: series.map((p) => p.value2 ?? null),
            borderColor: "#f43f5e",
            backgroundColor: "rgba(244,63,94,0.08)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ]
      : []),
  ];

  const data = { labels: series.map((p) => p.label), datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: hasSecond,
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
      x: { grid: { display: false }, ticks: { color: tick, maxRotation: 0, autoSkip: true } },
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
      <Line data={data} options={options} />
    </div>
  );
}
