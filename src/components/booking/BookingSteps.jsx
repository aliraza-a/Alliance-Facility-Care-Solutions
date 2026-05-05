import React from "react";

const steps = ["Service", "Details", "Schedule", "Confirm"];

export default function BookingSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300 ${
                i <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                i <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 lg:w-16 h-px transition-colors duration-300 ${
                i < currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}