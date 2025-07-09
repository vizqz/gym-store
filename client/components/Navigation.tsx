import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  LogOut,
  Shield,
  Briefcase,
  Package,
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
import { useCart } from "@/hooks/useCart";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/shop", label: "Tienda" },
    { href: "/about", label: "Nosotros" },
    { href: "/contact", label: "Contacto" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-fitness-yellow",
                  isActive(item.href)
                    ? "text-fitness-yellow"
                    : "text-foreground/80",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            {user ? (
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
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
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
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Panel de Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(user.role === "admin" || user.role === "worker") && (
                    <DropdownMenuItem asChild>
                      <Link to="/worker" className="cursor-pointer">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Panel de Empleado
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "customer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/my-orders" className="cursor-pointer">
                          <Package className="h-4 w-4 mr-2" />
                          Mis Pedidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {(user.role === "admin" || user.role === "worker") && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-1" />
                  Ingresar
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-fitness-yellow text-fitness-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getCartItemCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-fitness-yellow bg-fitness-yellow/10"
                      : "text-foreground/80 hover:text-fitness-yellow hover:bg-fitness-yellow/5",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar productos
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
