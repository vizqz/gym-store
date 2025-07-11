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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  TrendingUp,
  Users,
  ShoppingBag,
  Award,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Calendar,
  Download,
  Package,
  DollarSign,
  Eye,
  Search,
} from "lucide-react";
import { DashboardStats, User, Order, Product } from "@shared/types";
import {
  DashboardResponse,
  OrdersResponse,
  ProductsResponse,
} from "@shared/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workers, setWorkers] = useState<Omit<User, "password">[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Omit<
    User,
    "password"
  > | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter states
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");
  const [workerSearch, setWorkerSearch] = useState("");

  // Form states
  const [workerForm, setWorkerForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker" as "worker" | "admin",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "protein" as "protein" | "creatine" | "fat-burner" | "vitamins",
    stock: "",
    brand: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, ordersRes, productsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);

        if (dashboardRes.ok) {
          const data: DashboardResponse = await dashboardRes.json();
          setStats(data.stats);
          setWorkers(data.workers);
        }

        if (ordersRes.ok) {
          const ordersData: OrdersResponse = await ordersRes.json();
          setOrders(ordersData.orders);
        }

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.products);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status === orderFilter;
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
      worker.email.toLowerCase().includes(workerSearch.toLowerCase()),
  );

  const createWorker = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workerForm),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers([...workers, data.user]);
        setIsWorkerDialogOpen(false);
        setWorkerForm({
          name: "",
          email: "",
          password: "",
          role: "worker" as "worker" | "admin",
        });
      }
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  const updateWorker = async () => {
    if (!editingWorker) return;

    try {
      const response = await fetch(`/api/users/${editingWorker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workerForm),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers(
          workers.map((w) => (w.id === editingWorker.id ? data.user : w)),
        );
        setIsWorkerDialogOpen(false);
        setEditingWorker(null);
        setWorkerForm({
          name: "",
          email: "",
          password: "",
          role: "worker" as "worker" | "admin",
        });
      }
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const deleteWorker = async (workerId: number) => {
    try {
      const response = await fetch(`/api/users/${workerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorkers(workers.filter((w) => w.id !== workerId));
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          image:
            "https://via.placeholder.com/300x300/FFBF00/000000?text=" +
            encodeURIComponent(productForm.name),
          rating: 0,
          reviews: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts([...products, data.product]);
        setIsProductDialogOpen(false);
        setProductForm({
          name: "",
          description: "",
          price: "",
          category: "protein" as
            | "protein"
            | "creatine"
            | "fat-burner"
            | "vitamins",
          stock: "",
          brand: "",
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? data.product : p)),
        );
        setIsProductDialogOpen(false);
        setEditingProduct(null);
        setProductForm({
          name: "",
          description: "",
          price: "",
          category: "protein" as
            | "protein"
            | "creatine"
            | "fat-burner"
            | "vitamins",
          stock: "",
          brand: "",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openWorkerDialog = (worker?: Omit<User, "password">) => {
    if (worker) {
      setEditingWorker(worker);
      setWorkerForm({
        name: worker.name,
        email: worker.email,
        password: "",
        role: worker.role as "worker" | "admin",
      });
    } else {
      setEditingWorker(null);
      setWorkerForm({
        name: "",
        email: "",
        password: "",
        role: "worker" as "worker" | "admin",
      });
    }
    setIsWorkerDialogOpen(true);
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        brand: product.brand,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "protein" as
          | "protein"
          | "creatine"
          | "fat-burner"
          | "vitamins",
        stock: "",
        brand: "",
      });
    }
    setIsProductDialogOpen(true);
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

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
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
            Panel de Administración
          </h1>
          <p className="text-muted-foreground mt-2">
            Resumen de ventas y gestión de trabajadores
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-fitness-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/. {stats?.totalSales.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos acumulados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Mensuales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/. {stats?.monthlyRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Diciembre 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Órdenes
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                {ordersByStatus.delivered} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">En catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workers.length}</div>
              <p className="text-xs text-muted-foreground">Activos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="orders">Órdenes</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="workers">Empleados</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Most Sold Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-fitness-yellow" />
                    Productos Más Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.mostSoldProducts.map((item, index) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-fitness-yellow text-fitness-black rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.product.brand}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-fitness-yellow text-fitness-black">
                          {item.totalSold} vendidos
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-center text-muted-foreground py-4">
                        No hay datos disponibles
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-fitness-yellow" />
                    Estado de Órdenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pendientes
                      </span>
                      <Badge variant="destructive">
                        {ordersByStatus.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Confirmadas
                      </span>
                      <Badge variant="secondary">
                        {ordersByStatus.confirmed}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        En Proceso
                      </span>
                      <Badge variant="default">
                        {ordersByStatus.inProgress}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Entregadas
                      </span>
                      <Badge variant="outline">
                        {ordersByStatus.delivered}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Canceladas
                      </span>
                      <Badge variant="secondary">
                        {ordersByStatus.cancelled}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-fitness-yellow" />
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
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Orden</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.customerPhone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            S/. {order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-fitness-yellow" />
                    Gestión de Productos
                  </CardTitle>
                  <Button
                    onClick={() => openProductDialog()}
                    size="sm"
                    className="bg-fitness-yellow text-fitness-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Producto
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
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
                              <Link
                                to={`/products/${product.id}`}
                                className="font-medium text-sm hover:text-fitness-yellow transition-colors"
                              >
                                {product.name}
                              </Link>
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
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openProductDialog(product)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Eliminar producto?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se
                                      eliminará permanentemente el producto "
                                      {product.name}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteProduct(product.id)}
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-fitness-yellow" />
                    Gestión de Empleados
                  </CardTitle>
                  <Button
                    onClick={() => openWorkerDialog()}
                    size="sm"
                    className="bg-fitness-yellow text-fitness-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Empleado
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empleados..."
                    value={workerSearch}
                    onChange={(e) => setWorkerSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">
                          {worker.name}
                        </TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              worker.role === "admin"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {worker.role === "admin"
                              ? "Administrador"
                              : "Empleado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(worker.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openWorkerDialog(worker)}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar empleado?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se
                                    eliminará permanentemente la cuenta de "
                                    {worker.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteWorker(worker.id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-fitness-yellow" />
                    Reportes de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Reporte de Ventas (PDF)
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Órdenes (Excel)
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Lista de Productos (CSV)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-fitness-yellow" />
                    Análisis por Período
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Rango de fechas</Label>
                    <div className="flex gap-2">
                      <Input type="date" className="flex-1" />
                      <Input type="date" className="flex-1" />
                    </div>
                  </div>
                  <Button className="w-full bg-fitness-yellow text-fitness-black">
                    Generar Análisis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Worker Dialog */}
        <Dialog open={isWorkerDialogOpen} onOpenChange={setIsWorkerDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorker ? "Editar Empleado" : "Nuevo Empleado"}
              </DialogTitle>
              <DialogDescription>
                {editingWorker
                  ? "Modifica la información del empleado."
                  : "Completa la información del nuevo empleado."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="worker-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="worker-name"
                  value={workerForm.name}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="worker-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="worker-email"
                  type="email"
                  value={workerForm.email}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="worker-password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="worker-password"
                  type="password"
                  value={workerForm.password}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, password: e.target.value })
                  }
                  className="col-span-3"
                  placeholder={editingWorker ? "Dejar vacío para mantener" : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="worker-role" className="text-right">
                  Rol
                </Label>
                <Select
                  value={workerForm.role}
                  onValueChange={(value) =>
                    setWorkerForm({
                      ...workerForm,
                      role: value as "worker" | "admin",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worker">Empleado</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={editingWorker ? updateWorker : createWorker}
              >
                {editingWorker ? "Actualizar" : "Crear"} Empleado
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Product Dialog */}
        <Dialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifica la información del producto."
                  : "Completa la información del nuevo producto."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-brand" className="text-right">
                  Marca
                </Label>
                <Input
                  id="product-brand"
                  value={productForm.brand}
                  onChange={(e) =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-category" className="text-right">
                  Categoría
                </Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) =>
                    setProductForm({ ...productForm, category: value as any })
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
                <Label htmlFor="product-price" className="text-right">
                  Precio
                </Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="product-stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={editingProduct ? updateProduct : createProduct}
              >
                {editingProduct ? "Actualizar" : "Crear"} Producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
