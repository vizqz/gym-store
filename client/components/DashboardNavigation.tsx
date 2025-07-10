import { Link, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Shield,
  Briefcase,
  Package,
  BarChart3,
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  Home,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface DashboardNavigationProps {
  currentPanel: "admin" | "worker";
}

export function DashboardNavigation({
  currentPanel,
}: DashboardNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const adminNavItems = [
    { href: "/admin", label: "Resumen", icon: BarChart3 },
    { href: "/admin", label: "Órdenes", icon: ShoppingBag, hash: "#orders" },
    { href: "/admin", label: "Productos", icon: Package, hash: "#products" },
    { href: "/admin", label: "Empleados", icon: Users, hash: "#workers" },
    { href: "/admin", label: "Reportes", icon: TrendingUp, hash: "#reports" },
  ];

  const workerNavItems = [
    { href: "/worker", label: "Órdenes", icon: ShoppingBag },
    { href: "/worker", label: "Inventario", icon: Package, hash: "#inventory" },
    { href: "/worker", label: "Stock", icon: TrendingUp, hash: "#stock" },
    { href: "/worker", label: "Historial", icon: BarChart3, hash: "#history" },
  ];

  const navItems = currentPanel === "admin" ? adminNavItems : workerNavItems;

  const isActive = (href: string, hash?: string) => {
    if (hash) {
      return location.pathname === href && location.hash === hash;
    }
    return location.pathname === href && !location.hash;
  };

  const panelTitle =
    currentPanel === "admin" ? "Panel de Administración" : "Panel de Empleado";
  const panelIcon = currentPanel === "admin" ? Shield : Briefcase;
  const PanelIcon = panelIcon;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Panel Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-fitness-yellow rounded-full flex items-center justify-center">
                <span className="text-fitness-black font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-lg leading-none">
                  Stylo Fitness
                </span>
                <span className="text-fitness-yellow text-xs leading-none">
                  Store Supplement
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-border">
              <PanelIcon className="h-5 w-5 text-fitness-yellow" />
              <span className="text-foreground font-medium">{panelTitle}</span>
            </div>
          </div>

          {/* Dashboard Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = item.hash ? `${item.href}${item.hash}` : item.href;
              return (
                <Link
                  key={`${item.href}-${item.hash || "default"}`}
                  to={href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href, item.hash)
                      ? "text-fitness-yellow bg-fitness-yellow/10"
                      : "text-foreground/80 hover:text-fitness-yellow hover:bg-fitness-yellow/5",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Back to Store */}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="hidden md:flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Volver a la Tienda
              </Link>
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <User className="h-4 w-4" />
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "worker"
                            ? "secondary"
                            : "default"
                      }
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center font-medium"
                    >
                      {user.role === "admin"
                        ? "A"
                        : user.role === "worker"
                          ? "E"
                          : "C"}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Panel Navigation */}
                  {user.role === "admin" && currentPanel !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Panel de Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(user.role === "admin" || user.role === "worker") &&
                    currentPanel !== "worker" && (
                      <DropdownMenuItem asChild>
                        <Link to="/worker" className="cursor-pointer">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Panel de Empleado
                        </Link>
                      </DropdownMenuItem>
                    )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <Home className="h-4 w-4 mr-2" />
                      Ir a la Tienda
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Package className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              <div className="px-3 py-2 border-b border-border mb-2">
                <div className="flex items-center space-x-2">
                  <PanelIcon className="h-4 w-4 text-fitness-yellow" />
                  <span className="text-sm font-medium">{panelTitle}</span>
                </div>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const href = item.hash ? `${item.href}${item.hash}` : item.href;
                return (
                  <Link
                    key={`${item.href}-${item.hash || "default"}`}
                    to={href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive(item.href, item.hash)
                        ? "text-fitness-yellow bg-fitness-yellow/10"
                        : "text-foreground/80 hover:text-fitness-yellow hover:bg-fitness-yellow/5",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="px-3 py-2 border-t border-border mt-2">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-base font-medium text-foreground/80 hover:text-fitness-yellow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Volver a la Tienda</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
