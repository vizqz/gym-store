import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  CheckCircle,
  Clock,
  Edit3,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  History,
  X,
  Archive,
  ExternalLink,
} from "lucide-react";
import { Product, Order, StockMovement } from "@shared/types";
import { ProductsResponse, OrdersResponse } from "@shared/api";
import { useAuth } from "@/hooks/useAuth";

interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  date: string;
  workerName: string;
}

export default function WorkerPanel() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [stockQuantity, setStockQuantity] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "protein" as const,
    stock: "",
    brand: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.products);
        }

        if (ordersRes.ok) {
          const ordersData: OrdersResponse = await ordersRes.json();
          setOrders(ordersData.orders);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status === orderFilter;
  });

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const inProgressOrders = orders.filter(
    (order) => order.status === "in-progress",
  );
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  );

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus as any }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const addStock = async () => {
    if (!selectedProduct || !stockQuantity || !user) return;

    try {
      const response = await fetch(
        `/api/products/${selectedProduct.id}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: parseInt(stockQuantity),
            workerName: user.name,
          }),
        },
      );

      if (response.ok) {
        const updatedStock = selectedProduct.stock + parseInt(stockQuantity);
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id
              ? { ...product, stock: updatedStock }
              : product,
          ),
        );

        // Add to stock movements
        const newMovement: StockMovement = {
          id: Date.now(),
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: parseInt(stockQuantity),
          date: new Date().toISOString(),
          workerName: user.name,
        };
        setStockMovements([newMovement, ...stockMovements]);

        setIsStockDialogOpen(false);
        setSelectedProduct(null);
        setStockQuantity("");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const addNewProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !user)
      return;

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          image:
            "https://via.placeholder.com/300x300/FFBF00/000000?text=" +
            encodeURIComponent(newProduct.name),
          rating: 0,
          reviews: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts([...products, data.product]);
        setIsProductDialogOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "protein",
          stock: "",
          brand: "",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "confirmed":
        return "secondary";
      case "in-progress":
        return "default";
      case "delivered":
        return "outline";
      case "cancelled":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmado";
      case "in-progress":
        return "En Proceso";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const canUpdateOrder = (status: string) => {
    return status !== "delivered" && status !== "cancelled";
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "in-progress";
      case "confirmed":
        return "in-progress";
      case "in-progress":
        return "delivered";
      default:
        return null;
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Panel de Empleado
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestión de inventario y órdenes
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-fitness-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inProgressOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">Órdenes activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter((p) => p.stock < 10).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Productos con stock &lt; 10
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Órdenes</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-fitness-yellow" />
                    Gestión de Órdenes
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={orderFilter} onValueChange={setOrderFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las órdenes</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="confirmed">Confirmadas</SelectItem>
                        <SelectItem value="in-progress">En proceso</SelectItem>
                        <SelectItem value="delivered">Entregadas</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay órdenes para mostrar
                    </p>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-muted/30 rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Orden #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerPhone}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className="bg-fitness-yellow text-fitness-black">
                              S/. {order.total.toFixed(2)}
                            </Badge>
                            <Badge
                              variant={getStatusBadgeColor(order.status)}
                              className="block"
                            >
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">
                            Productos: {order.items.length} artículos
                          </p>
                          <p className="text-muted-foreground">
                            Método:{" "}
                            {order.delivery.method === "delivery"
                              ? "Delivery"
                              : "Recojo en tienda"}
                          </p>
                          {order.delivery.method === "delivery" &&
                            order.delivery.address && (
                              <p className="text-muted-foreground">
                                Dirección: {order.delivery.address},{" "}
                                {order.delivery.district}
                              </p>
                            )}
                          {order.delivery.method === "pickup" &&
                            order.delivery.location && (
                              <p className="text-muted-foreground">
                                Sucursal:{" "}
                                {order.delivery.location === "main-gym"
                                  ? "Principal"
                                  : "Sucursal Norte"}
                              </p>
                            )}
                          <p className="text-muted-foreground">
                            Pago: {order.payment.method}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            asChild
                            className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                          >
                            <Link to={`/orders/${order.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Gestionar Orden
                            </Link>
                          </Button>
                          {canUpdateOrder(order.status) &&
                            order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateOrderStatus(order.id, "cancelled")
                                }
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancelar
                              </Button>
                            )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-fitness-yellow" />
                    Gestión de Inventario
                  </CardTitle>
                  <Dialog
                    open={isProductDialogOpen}
                    onOpenChange={setIsProductDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-fitness-yellow text-fitness-black"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Nuevo Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                        <DialogDescription>
                          Completa la información del nuevo producto.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="brand" className="text-right">
                            Marca
                          </Label>
                          <Input
                            id="brand"
                            value={newProduct.brand}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                brand: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Categoría
                          </Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) =>
                              setNewProduct({
                                ...newProduct,
                                category: value as any,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="protein">Proteínas</SelectItem>
                              <SelectItem value="creatine">Creatina</SelectItem>
                              <SelectItem value="fat-burner">
                                Quemadores
                              </SelectItem>
                              <SelectItem value="vitamins">
                                Vitaminas
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Precio
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stock" className="text-right">
                            Stock
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                stock: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Descripción
                          </Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={addNewProduct}>
                          Agregar Producto
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.brand}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.category === "protein"
                                ? "Proteínas"
                                : product.category === "creatine"
                                  ? "Creatina"
                                  : product.category === "fat-burner"
                                    ? "Quemadores"
                                    : "Vitaminas"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock < 10
                                  ? "destructive"
                                  : product.stock < 20
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            S/. {product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Management Tab */}
          <TabsContent value="stock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-fitness-yellow" />
                  Gestión de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar producto para agregar stock..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid gap-3">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.brand}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stock actual: {product.stock}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-fitness-yellow text-fitness-black"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Agregar Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Agregar Stock</DialogTitle>
                              <DialogDescription>
                                Agregar stock para {product.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="current-stock"
                                  className="text-right"
                                >
                                  Stock Actual
                                </Label>
                                <Input
                                  id="current-stock"
                                  value={product.stock}
                                  disabled
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="add-quantity"
                                  className="text-right"
                                >
                                  Cantidad
                                </Label>
                                <Input
                                  id="add-quantity"
                                  type="number"
                                  placeholder="Cantidad a agregar"
                                  value={stockQuantity}
                                  onChange={(e) =>
                                    setStockQuantity(e.target.value)
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              {stockQuantity && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">
                                    Nuevo Stock
                                  </Label>
                                  <Input
                                    value={
                                      product.stock +
                                      parseInt(stockQuantity || "0")
                                    }
                                    disabled
                                    className="col-span-3 font-bold"
                                  />
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={addStock}>
                                Agregar Stock
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-fitness-yellow" />
                  Historial de Movimientos de Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {stockMovements.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay movimientos de stock registrados
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Empleado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>
                              {new Date(movement.date).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {movement.productName}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">
                                +{movement.quantity}
                              </Badge>
                            </TableCell>
                            <TableCell>{movement.workerName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
