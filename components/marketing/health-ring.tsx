"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HealthRingProps {
  score: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
}

export function HealthRing({
  score,
  size = 140,
  stroke = 12,
  label = "Health Score",
}: HealthRingProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f97316" : "#ef4444";

  // Animate the arc only after mount so SSR markup (static, filled to `offset`)
  // matches the first client render — avoids a strokeDashoffset hydration
  // mismatch from framer-motion's inline initial value.
  const animate = mounted && !reduce;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          {...(animate
            ? {
                initial: { strokeDashoffset: circumference },
                whileInView: { strokeDashoffset: offset },
                viewport: { once: true },
                transition: { duration: 1.4, ease: "easeOut" },
              }
            : {})}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="font-display text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
