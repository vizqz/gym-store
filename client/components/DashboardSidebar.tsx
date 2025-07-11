import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  Shield,
  Briefcase,
  Clock,
  History,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarItem {
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  userRole: "admin" | "worker";
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const location = useLocation();
  const { user, logout } = useAuth();

  const adminItems: SidebarItem[] = [
    {
      label: "Resumen",
      icon: BarChart3,
      href: "/admin",
    },
    {
      label: "Gestión de Órdenes",
      icon: ShoppingBag,
      children: [
        {
          label: "Todas las Órdenes",
          icon: ShoppingBag,
          href: "/admin#orders",
        },
        { label: "Pendientes", icon: Clock, href: "/admin#orders-pending" },
        {
          label: "En Proceso",
          icon: TrendingUp,
          href: "/admin#orders-progress",
        },
      ],
    },
    {
      label: "Productos",
      icon: Package,
      children: [
        {
          label: "Todos los Productos",
          icon: Package,
          href: "/admin#products",
        },
        { label: "Agregar Producto", icon: Plus, href: "/admin#products-new" },
        {
          label: "Stock Bajo",
          icon: TrendingUp,
          href: "/admin#products-low-stock",
        },
      ],
    },
    {
      label: "Empleados",
      icon: Users,
      href: "/admin#workers",
    },
    {
      label: "Reportes",
      icon: TrendingUp,
      href: "/admin#reports",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/admin#settings",
    },
  ];

  const workerItems: SidebarItem[] = [
    {
      label: "Gestión de Órdenes",
      icon: ShoppingBag,
      children: [
        { label: "Órdenes Activas", icon: Clock, href: "/worker#orders" },
        {
          label: "Pendientes",
          icon: ShoppingBag,
          href: "/worker#orders-pending",
        },
        {
          label: "En Proceso",
          icon: TrendingUp,
          href: "/worker#orders-progress",
        },
      ],
    },
    {
      label: "Inventario",
      icon: Package,
      children: [
        {
          label: "Todos los Productos",
          icon: Package,
          href: "/worker#inventory",
        },
        {
          label: "Agregar Producto",
          icon: Plus,
          href: "/worker#inventory-new",
        },
        {
          label: "Stock Bajo",
          icon: TrendingUp,
          href: "/worker#inventory-low",
        },
      ],
    },
    {
      label: "Gestión de Stock",
      icon: TrendingUp,
      href: "/worker#stock",
    },
    {
      label: "Historial",
      icon: History,
      href: "/worker#history",
    },
  ];

  const items = userRole === "admin" ? adminItems : workerItems;

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (href: string) => {
    const currentPath = location.pathname + location.hash;
    if (href.includes("#")) {
      return currentPath === href;
    }
    return location.pathname === href;
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.label);

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleSection(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:bg-fitness-yellow/10 hover:text-fitness-yellow",
              "text-muted-foreground",
              level > 0 && "ml-4",
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              <>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </button>
          {isExpanded && !isCollapsed && (
            <div className="mt-1 space-y-1">
              {item.children?.map((child) =>
                renderSidebarItem(child, level + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href!}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1",
          isActive(item.href!)
            ? "bg-fitness-yellow text-fitness-black shadow-sm"
            : "text-muted-foreground hover:bg-fitness-yellow/10 hover:text-fitness-yellow",
          level > 0 && "ml-6",
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && item.badge && (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground text-xs"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-fitness-yellow rounded-lg flex items-center justify-center">
              <span className="text-fitness-black font-bold text-sm">S</span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sm">Stylo Fitness</h2>
                <div className="flex items-center space-x-1">
                  {userRole === "admin" ? (
                    <Shield className="h-3 w-3 text-fitness-yellow" />
                  ) : (
                    <Briefcase className="h-3 w-3 text-fitness-yellow" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {userRole === "admin" ? "Administrador" : "Empleado"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => renderSidebarItem(item))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-fitness-yellow/10 hover:text-fitness-yellow transition-colors"
        >
          <Home className="h-4 w-4" />
          {!isCollapsed && <span>Volver a la Tienda</span>}
        </Link>

        {!isCollapsed && user && (
          <div className="px-3 py-2 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
