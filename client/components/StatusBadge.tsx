import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  Truck,
  XCircle,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type StatusType =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "delivered"
  | "cancelled"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "low-stock"
  | "medium-stock"
  | "high-stock";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    icon: React.ComponentType<any>;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    variant: "destructive",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    variant: "secondary",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "in-progress": {
    label: "En Proceso",
    icon: PlayCircle,
    variant: "default",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  delivered: {
    label: "Entregado",
    icon: Truck,
    variant: "outline",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    variant: "secondary",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  success: {
    label: "Éxito",
    icon: CheckCircle,
    variant: "outline",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  warning: {
    label: "Advertencia",
    icon: AlertTriangle,
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  error: {
    label: "Error",
    icon: XCircle,
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  info: {
    label: "Información",
    icon: Package,
    variant: "default",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "low-stock": {
    label: "Stock Bajo",
    icon: TrendingDown,
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  "medium-stock": {
    label: "Stock Medio",
    icon: Package,
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  "high-stock": {
    label: "Stock Alto",
    icon: TrendingUp,
    variant: "outline",
    className: "bg-green-100 text-green-800 border-green-200",
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center space-x-1 font-medium",
        config.className,
        className,
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{label || config.label}</span>
    </Badge>
  );
}
