import { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function QuickActionButton({
  icon,
  label,
  description,
  onClick,
  href,
  variant = "outline",
  size = "md",
  className,
  disabled,
}: QuickActionButtonProps) {
  const sizeClasses = {
    sm: "p-4 space-y-2",
    md: "p-6 space-y-3",
    lg: "p-8 space-y-4",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        sizeClasses[size],
      )}
    >
      <div
        className={cn(
          "p-3 bg-fitness-yellow/10 rounded-lg mb-2",
          iconSizes[size],
        )}
      >
        <div className={cn(iconSizes[size], "text-fitness-yellow")}>{icon}</div>
      </div>
      <h3 className="font-medium text-foreground">{label}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Button
        variant={variant}
        asChild
        className={cn(
          "h-auto min-h-[120px] hover:bg-fitness-yellow/5 hover:border-fitness-yellow transition-all duration-200",
          className,
        )}
        disabled={disabled}
      >
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "h-auto min-h-[120px] hover:bg-fitness-yellow/5 hover:border-fitness-yellow transition-all duration-200",
        className,
      )}
      disabled={disabled}
    >
      {content}
    </Button>
  );
}
