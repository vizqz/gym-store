import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    {
                      "bg-fitness-yellow border-fitness-yellow text-fitness-black":
                        isCompleted || isCurrent,
                      "border-muted bg-background text-muted-foreground":
                        isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    <div className="w-5 h-5">{step.icon}</div>
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-2 text-center max-w-[120px]">
                  <p
                    className={cn("text-sm font-medium", {
                      "text-foreground": isCompleted || isCurrent,
                      "text-muted-foreground": isUpcoming,
                    })}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 mb-8">
                  <div
                    className={cn("h-0.5 transition-all duration-200", {
                      "bg-fitness-yellow": stepNumber < currentStep,
                      "bg-muted": stepNumber >= currentStep,
                    })}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
