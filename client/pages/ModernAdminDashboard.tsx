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
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Award,
  BarChart3,
  Download,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import { DashboardStats, User, Order, Product } from "@shared/types";
import {
  DashboardResponse,
  OrdersResponse,
  ProductsResponse,
} from "@shared/api";

export default function ModernAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workers, setWorkers] = useState<Omit<User, "password">[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Dialog states
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Omit<
    User,
    "password"
  > | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
      cell: (value) => new Date(value).toLocaleDateString("es-ES"),
      sortable: true,
      width: "100px",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (_, row) => (
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      ),
      width: "80px",
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
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openProductDialog(row)}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente "{row.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteProduct(row.id)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      width: "100px",
    },
  ];

  // Worker columns for DataTable
  const workerColumns: ColumnDef<Omit<User, "password">>[] = [
    {
      id: "name",
      header: "Nombre",
      accessorKey: "name",
      sortable: true,
      filterable: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      sortable: true,
      filterable: true,
    },
    {
      id: "role",
      header: "Rol",
      accessorKey: "role",
      cell: (value) => (
        <Badge variant={value === "admin" ? "destructive" : "secondary"}>
          {value === "admin" ? "Administrador" : "Empleado"}
        </Badge>
      ),
      sortable: true,
      width: "120px",
    },
    {
      id: "createdAt",
      header: "Fecha",
      accessorKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString("es-ES"),
      sortable: true,
      width: "100px",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (_, row) => (
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openWorkerDialog(row)}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente la cuenta de "{row.name}
                  ".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteWorker(row.id)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      width: "100px",
    },
  ];

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

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Panel de Administración">
        <LoadingState variant="dashboard" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Panel de Administración"
      description="Gestiona tu negocio con herramientas completas"
      headerActions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button
            size="sm"
            className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="workers">Empleados</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Ventas Totales"
              value={`S/. ${stats?.totalSales.toFixed(2) || "0.00"}`}
              description="Ingresos acumulados"
              icon={<DollarSign className="h-5 w-5 text-fitness-yellow" />}
              trend="up"
              trendValue="+12.5%"
            />
            <MetricCard
              title="Ingresos Mensuales"
              value={`S/. ${stats?.monthlyRevenue.toFixed(2) || "0.00"}`}
              description="Diciembre 2024"
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
              trend="up"
              trendValue="+8.2%"
            />
            <MetricCard
              title="Total Órdenes"
              value={orders.length}
              description={`${ordersByStatus.delivered} completadas`}
              icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
              trend="up"
              trendValue="+15.3%"
            />
            <MetricCard
              title="Productos"
              value={products.length}
              description="En catálogo"
              icon={<Package className="h-5 w-5 text-purple-500" />}
            />
            <MetricCard
              title="Empleados"
              value={workers.length}
              description="Activos"
              icon={<Users className="h-5 w-5 text-orange-500" />}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionButton
                  icon={<Plus />}
                  label="Nuevo Producto"
                  description="Agregar producto al catálogo"
                  onClick={() => openProductDialog()}
                />
                <QuickActionButton
                  icon={<Users />}
                  label="Nuevo Empleado"
                  description="Crear cuenta de empleado"
                  onClick={() => openWorkerDialog()}
                />
                <QuickActionButton
                  icon={<BarChart3 />}
                  label="Ver Reportes"
                  description="Análisis y estadísticas"
                  onClick={() => setActiveTab("reports")}
                />
                <QuickActionButton
                  icon={<Download />}
                  label="Exportar Datos"
                  description="Descargar información"
                />
              </div>
            </CardContent>
          </Card>

          {/* Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
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
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-fitness-yellow text-fitness-black rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <Link
                            to={`/products/${item.product.id}`}
                            className="font-medium text-sm hover:text-fitness-yellow transition-colors"
                          >
                            {item.product.name}
                          </Link>
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

            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-fitness-yellow" />
                  Estado de Órdenes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Pendientes
                    </span>
                    <StatusBadge
                      status="pending"
                      label={ordersByStatus.pending.toString()}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Confirmadas
                    </span>
                    <StatusBadge
                      status="confirmed"
                      label={ordersByStatus.confirmed.toString()}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      En Proceso
                    </span>
                    <StatusBadge
                      status="in-progress"
                      label={ordersByStatus.inProgress.toString()}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Entregadas
                    </span>
                    <StatusBadge
                      status="delivered"
                      label={ordersByStatus.delivered.toString()}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Canceladas
                    </span>
                    <StatusBadge
                      status="cancelled"
                      label={ordersByStatus.cancelled.toString()}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <DataTable
            title="Gestión de Órdenes"
            description="Administra todas las órdenes del sistema"
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

        {/* Products Tab */}
        <TabsContent value="products">
          <DataTable
            title="Gestión de Productos"
            description="Administra el catálogo de productos"
            data={products}
            columns={productColumns}
            searchPlaceholder="Buscar productos..."
            pageSize={15}
            actions={
              <Button
                onClick={() => openProductDialog()}
                size="sm"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            }
          />
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers">
          <DataTable
            title="Gestión de Empleados"
            description="Administra las cuentas de empleados"
            data={workers}
            columns={workerColumns}
            searchPlaceholder="Buscar empleados..."
            pageSize={15}
            actions={
              <Button
                onClick={() => openWorkerDialog()}
                size="sm"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </Button>
            }
          />
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
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
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
    </DashboardLayout>
  );
}
