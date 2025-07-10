import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Package,
  Star,
  Calendar,
  User,
  Edit3,
  TrendingUp,
  Plus,
  Minus,
} from "lucide-react";
import { Product, StockMovement } from "@shared/types";
import { ProductResponse } from "@shared/api";
import { useAuth } from "@/hooks/useAuth";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        const [productRes, movementsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/stock-movements?productId=${productId}`),
        ]);

        if (productRes.ok) {
          const productData: ProductResponse = await productRes.json();
          setProduct(productData.product);
        }

        if (movementsRes.ok) {
          const movementsData = await movementsRes.json();
          setStockMovements(movementsData.movements);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const canEdit = user && (user.role === "admin" || user.role === "worker");

  const getStockStatusColor = (stock: number) => {
    if (stock < 10) return "destructive";
    if (stock < 20) return "secondary";
    return "default";
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "protein":
        return "Proteínas";
      case "creatine":
        return "Creatina";
      case "fat-burner":
        return "Quemadores";
      case "vitamins":
        return "Vitaminas";
      default:
        return category;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-yellow"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Producto no encontrado
            </h1>
            <Button onClick={() => navigate(-1)}>Volver</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {product.name}
              </h1>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
          </div>
          {canEdit && (
            <div className="flex items-center space-x-2">
              {user.role === "admin" && (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin">
                    <Edit3 className="h-4 w-4 mr-1" />
                    Editar en Admin
                  </Link>
                </Button>
              )}
              {(user.role === "admin" || user.role === "worker") && (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/worker">
                    <Package className="h-4 w-4 mr-1" />
                    Gestionar Stock
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-fitness-yellow" />
                  Información del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-48 h-48 object-cover rounded-lg border border-border"
                  />
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Categoría
                    </label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {getCategoryName(product.category)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Precio
                    </label>
                    <p className="text-2xl font-bold text-fitness-yellow">
                      S/. {product.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Stock Disponible
                    </label>
                    <div className="mt-1">
                      <Badge variant={getStockStatusColor(product.stock)}>
                        {product.stock} unidades
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Calificación
                    </label>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-fitness-yellow mr-1" />
                      <span className="font-medium">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({product.reviews.length} reseñas)
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-fitness-yellow" />
                    Reseñas de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{review.user}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "text-fitness-yellow fill-current"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString(
                                "es-ES",
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Estado del Stock
                  </span>
                  <Badge variant={getStockStatusColor(product.stock)}>
                    {product.stock < 10
                      ? "Stock Bajo"
                      : product.stock < 20
                        ? "Stock Medio"
                        : "Stock Alto"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Reseñas
                  </span>
                  <span className="font-medium">{product.reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Producto Destacado
                  </span>
                  <span className="font-medium">
                    {product.featured ? "Sí" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Más Vendido
                  </span>
                  <span className="font-medium">
                    {product.bestSeller ? "Sí" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movements History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-fitness-yellow" />
                  Historial de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stockMovements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No hay movimientos de stock registrados
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Por</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell className="text-xs">
                              {new Date(movement.date).toLocaleDateString(
                                "es-ES",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {movement.type === "addition" ? (
                                  <Plus className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <Minus className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span
                                  className={
                                    movement.type === "addition"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {movement.quantity}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              {movement.workerName}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions for Admin/Workers */}
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.role === "admin" && (
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/admin">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Producto
                      </Link>
                    </Button>
                  )}
                  {(user.role === "admin" || user.role === "worker") && (
                    <Button
                      className="w-full bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                      asChild
                    >
                      <Link to="/worker">
                        <Package className="h-4 w-4 mr-2" />
                        Gestionar Stock
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
