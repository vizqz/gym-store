import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const predefinedUsers = [
    {
      email: "admin@stylofit.com",
      password: "admin123",
      role: "Administrador",
      color: "bg-red-500",
    },
    {
      email: "worker@stylofit.com",
      password: "worker123",
      role: "Empleado",
      color: "bg-blue-500",
    },
    {
      email: "customer@stylofit.com",
      password: "customer123",
      role: "Cliente",
      color: "bg-green-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login({ email, password });

    if (success) {
      // Redirect based on user role
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        switch (user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "worker":
            navigate("/worker");
            break;
          case "customer":
          default:
            navigate("/");
            break;
        }
      } else {
        navigate("/");
      }
    } else {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }

    setIsLoading(false);
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-fitness-yellow rounded-full flex items-center justify-center">
              <span className="text-fitness-black font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-xl">
                Stylo Fitness
              </span>
              <span className="text-fitness-yellow text-sm">
                Store Supplement
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Iniciar Sesión</h1>
        </div>

        {/* Quick Login Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-center text-muted-foreground">
              Usuarios de prueba:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {predefinedUsers.map((user) => (
              <Button
                key={user.email}
                variant="outline"
                className="w-full justify-between"
                onClick={() => quickLogin(user.email, user.password)}
              >
                <span>{user.email}</span>
                <Badge className={`${user.color} text-white`}>
                  {user.role}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="usuario@stylofit.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <Button
            variant="link"
            className="text-fitness-yellow hover:text-fitness-yellow/80"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
