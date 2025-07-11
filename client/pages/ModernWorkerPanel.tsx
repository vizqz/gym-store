import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingState } from "@/components/LoadingState";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Package,
  Clock,
  TrendingUp,
  Plus,
  Search,
  ExternalLink,
  X,
  History,
  RefreshCw,
  Filter,
  ShoppingBag,
  Archive,
  CheckCircle,
} from "lucide-react";
import { Product, Order, StockMovement } from "@shared/types";
import { ProductsResponse, OrdersResponse } from "@shared/api";
import { useAuth } from "@/hooks/useAuth";

export default function ModernWorkerPanel() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

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
    category: "protein" as "protein" | "creatine" | "fat-burner" | "vitamins",
    stock: "",
    brand: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, movementsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/stock-movements"),
        ]);

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.products);
        }

        if (ordersRes.ok) {
          const ordersData: OrdersResponse = await ordersRes.json();
          setOrders(ordersData.orders);
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
  }, []);

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
            reason: "Stock añadido manualmente",
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id ? data.product : product,
          ),
        );

        // Refresh stock movements from API
        const movementsRes = await fetch("/api/stock-movements");
        if (movementsRes.ok) {
          const movementsData = await movementsRes.json();
          setStockMovements(movementsData.movements);
        }

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

  // Order columns for DataTable
  const orderColumns: ColumnDef<Order>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (value) => <span className="font-mono">#{value}</span>,
      sortable: true,
      width: "80px",
    },
    {
      id: "customer",
      header: "Cliente",
      accessorKey: "customerName",
      cell: (_, row) => (
        <div>
          <p className="font-medium">{row.customerName}</p>
          <p className="text-sm text-muted-foreground">{row.customerPhone}</p>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      id: "items",
      header: "Productos",
      accessorKey: "items",
      cell: (value) => (
        <span className="text-sm">{value.length} artículos</span>
      ),
      width: "100px",
    },
    {
      id: "total",
      header: "Total",
      accessorKey: "total",
      cell: (value) => (
        <span className="font-semibold">S/. {value.toFixed(2)}</span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      id: "status",
      header: "Estado",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
      sortable: true,
      filterable: true,
      width: "120px",
    },
    {
      id: "date",
      header: "Fecha",
      accessorKey: "date",
      cell: (value) =>
        new Date(value).toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortable: true,
      width: "120px",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (_, row) => (
        <div className="flex items-center space-x-1">
          <Button size="sm" asChild>
            <Link
              to={`/orders/${row.id}`}
              className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Gestionar
            </Link>
          </Button>
          {row.status === "pending" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateOrderStatus(row.id, "cancelled")}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
      width: "140px",
    },
  ];

  // Product columns for DataTable
  const productColumns: ColumnDef<Product>[] = [
    {
      id: "name",
      header: "Producto",
      accessorKey: "name",
      cell: (_, row) => (
        <div>
          <Link
            to={`/products/${row.id}`}
            className="font-medium hover:text-fitness-yellow transition-colors"
          >
            {row.name}
          </Link>
          <p className="text-sm text-muted-foreground">{row.brand}</p>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      id: "category",
      header: "Categoría",
      accessorKey: "category",
      cell: (value) => (
        <Badge variant="outline">
          {value === "protein"
            ? "Proteínas"
            : value === "creatine"
              ? "Creatina"
              : value === "fat-burner"
                ? "Quemadores"
                : "Vitaminas"}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      width: "120px",
    },
    {
      id: "stock",
      header: "Stock",
      accessorKey: "stock",
      cell: (value) => (
        <StatusBadge
          status={
            value < 10
              ? "low-stock"
              : value < 20
                ? "medium-stock"
                : "high-stock"
          }
          label={`${value} unidades`}
        />
      ),
      sortable: true,
      width: "140px",
    },
    {
      id: "price",
      header: "Precio",
      accessorKey: "price",
      cell: (value) => (
        <span className="font-semibold">S/. {value.toFixed(2)}</span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedProduct(row);
            setIsStockDialogOpen(true);
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          Stock
        </Button>
      ),
      width: "100px",
    },
  ];

  // Stock movement columns for DataTable
  const stockMovementColumns: ColumnDef<StockMovement>[] = [
    {
      id: "date",
      header: "Fecha",
      accessorKey: "date",
      cell: (value) =>
        new Date(value).toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortable: true,
      width: "120px",
    },
    {
      id: "product",
      header: "Producto",
      accessorKey: "productName",
      cell: (value) => <span className="font-medium">{value}</span>,
      sortable: true,
      filterable: true,
    },
    {
      id: "quantity",
      header: "Cantidad",
      accessorKey: "quantity",
      cell: (value, row) => (
        <div className="flex items-center">
          <span
            className={
              row.type === "addition" ? "text-green-600" : "text-red-600"
            }
          >
            {row.type === "addition" ? "+" : "-"}
            {value}
          </span>
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      id: "worker",
      header: "Empleado",
      accessorKey: "workerName",
      sortable: true,
      filterable: true,
      width: "120px",
    },
    {
      id: "reason",
      header: "Motivo",
      accessorKey: "reason",
      cell: (value) => (
        <span className="text-sm text-muted-foreground">
          {value || "Sin especificar"}
        </span>
      ),
    },
  ];

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const inProgressOrders = orders.filter(
    (order) => order.status === "in-progress",
  );
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  );
  const lowStockProducts = products.filter((product) => product.stock < 10);

  if (isLoading) {
    return (
      <DashboardLayout title="Panel de Empleado">
        <LoadingState variant="dashboard" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Panel de Empleado"
      description="Gestiona órdenes, inventario y stock"
      headerActions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button
            size="sm"
            className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
            onClick={() => setIsProductDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Producto
          </Button>
        </div>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Órdenes Pendientes"
            value={pendingOrders.length}
            description="Requieren atención"
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            variant={pendingOrders.length > 0 ? "warning" : "default"}
          />
          <MetricCard
            title="En Proceso"
            value={inProgressOrders.length}
            description="Órdenes activas"
            icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
          />
          <MetricCard
            title="Completadas Hoy"
            value={completedOrders.length}
            description="Entregadas"
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            variant="success"
          />
          <MetricCard
            title="Stock Bajo"
            value={lowStockProducts.length}
            description="Productos < 10 unidades"
            icon={<Package className="h-5 w-5 text-red-500" />}
            variant={lowStockProducts.length > 0 ? "danger" : "default"}
          />
        </div>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionButton
                  icon={<Clock />}
                  label="Órdenes Pendientes"
                  description={`${pendingOrders.length} órdenes esperando`}
                  onClick={() => setActiveTab("orders")}
                  variant={pendingOrders.length > 0 ? "default" : "outline"}
                />
                <QuickActionButton
                  icon={<TrendingUp />}
                  label="Gestionar Stock"
                  description="Añadir o actualizar inventario"
                  onClick={() => setActiveTab("stock")}
                />
                <QuickActionButton
                  icon={<Plus />}
                  label="Nuevo Producto"
                  description="Agregar al catálogo"
                  onClick={() => setIsProductDialogOpen(true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <DataTable
            title="Gestión de Órdenes"
            description="Administra el flujo de órdenes"
            data={orders}
            columns={orderColumns}
            searchPlaceholder="Buscar órdenes..."
            pageSize={15}
            actions={
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            }
          />
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <DataTable
            title="Gestión de Inventario"
            description="Administra el catálogo de productos"
            data={products}
            columns={productColumns}
            searchPlaceholder="Buscar productos..."
            pageSize={15}
            actions={
              <Button
                onClick={() => setIsProductDialogOpen(true)}
                size="sm"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            }
          />
        </TabsContent>

        {/* Stock Management Tab */}
        <TabsContent value="stock" className="space-y-6">
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos con Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.brand} - Stock: {product.stock}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsStockDialogOpen(true);
                        }}
                        className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir Stock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Management Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Stock por Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/products/${product.id}`}
                        className="font-medium hover:text-fitness-yellow transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {product.brand} - Stock actual: {product.stock}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge
                        status={
                          product.stock < 10
                            ? "low-stock"
                            : product.stock < 20
                              ? "medium-stock"
                              : "high-stock"
                        }
                        label={`${product.stock} unidades`}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsStockDialogOpen(true);
                        }}
                        className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <DataTable
            title="Historial de Movimientos de Stock"
            description="Registro completo de cambios en inventario"
            data={stockMovements}
            columns={stockMovementColumns}
            searchPlaceholder="Buscar movimientos..."
            pageSize={20}
          />
        </TabsContent>
      </Tabs>

      {/* Stock Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Stock</DialogTitle>
            <DialogDescription>
              Agregar stock para {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-stock" className="text-right">
                Stock Actual
              </Label>
              <Input
                id="current-stock"
                value={selectedProduct?.stock || 0}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="add-quantity"
                type="number"
                placeholder="Cantidad a agregar"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="col-span-3"
              />
            </div>
            {stockQuantity && selectedProduct && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nuevo Stock</Label>
                <Input
                  value={selectedProduct.stock + parseInt(stockQuantity || "0")}
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

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
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
                  setNewProduct({ ...newProduct, name: e.target.value })
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
                  setNewProduct({ ...newProduct, brand: e.target.value })
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
                  setNewProduct({ ...newProduct, category: value as any })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protein">Proteínas</SelectItem>
                  <SelectItem value="creatine">Creatina</SelectItem>
                  <SelectItem value="fat-burner">Quemadores</SelectItem>
                  <SelectItem value="vitamins">Vitaminas</SelectItem>
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
                  setNewProduct({ ...newProduct, price: e.target.value })
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
                  setNewProduct({ ...newProduct, stock: e.target.value })
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
                  setNewProduct({ ...newProduct, description: e.target.value })
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
    </DashboardLayout>
  );
}
