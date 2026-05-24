"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

type Step = "loading" | "identify" | "verify" | "details" | "payment" | "success";

interface StepIndicatorProps {
  currentStep: Step;
}

const STEPS = [
  { key: "identify", label: "Login" },
  { key: "details", label: "Details" },
  { key: "payment", label: "Payment" },
] as const;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {STEPS.map((s, i) => {
        const isActive = s.key === currentStep;
        const isComplete = i < currentIndex;

        return (
          <React.Fragment key={s.key}>
            <div
              className={`flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "text-primary font-black"
                  : isComplete
                  ? "text-green-600 font-bold"
                  : "text-charcoal/40 font-bold"
              } text-xs uppercase tracking-widest`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isComplete
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-charcoal/10"
                }`}
              >
                {isComplete ? "✓" : i + 1}
              </span>
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight size={14} className="text-charcoal/20" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}