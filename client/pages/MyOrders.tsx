import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  MessageSquare,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Order, Product } from "@shared/types";
import { ProductsResponse } from "@shared/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`/api/orders/customer/${user?.id}`),
          fetch("/api/products"),
        ]);

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.products);
        } else {
          const { mockProducts } = await import("@shared/mockData");
          setProducts(mockProducts);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        } else {
          // Mock customer orders for demo
          const customerOrders = [
            {
              id: 101,
              customerId: user?.id || 3,
              items: [
                { productId: 1, quantity: 2 },
                { productId: 6, quantity: 1 },
              ],
              customerName: user?.name || "Carlos Cliente",
              customerPhone: "+51 987 654 321",
              customerEmail: user?.email,
              delivery: {
                method: "delivery" as const,
                address: "Av. Lima 123, San Isidro",
                district: "San Isidro",
                reference: "Edificio verde, piso 5",
              },
              payment: {
                method: "yape" as const,
              },
              total: 465.9,
              status: "delivered" as const,
              date: "2024-12-01T10:30:00Z",
              estimatedDelivery: "2024-12-03T18:00:00Z",
              // Legacy fields
              customerAddress: "Av. Lima 123, San Isidro",
              deliveryMethod: "delivery" as const,
              location: "main-gym" as const,
            },
            {
              id: 102,
              customerId: user?.id || 3,
              items: [{ productId: 14, quantity: 1 }],
              customerName: user?.name || "Carlos Cliente",
              customerPhone: "+51 987 654 321",
              customerEmail: user?.email,
              delivery: {
                method: "pickup" as const,
                location: "main-gym" as const,
              },
              payment: {
                method: "cash" as const,
              },
              total: 145.2,
              status: "confirmed" as const,
              date: "2024-12-05T14:15:00Z",
              estimatedDelivery: "2024-12-07T16:00:00Z",
              // Legacy fields
              customerAddress: "",
              deliveryMethod: "pickup" as const,
              location: "main-gym" as const,
            },
            {
              id: 103,
              customerId: user?.id || 3,
              items: [
                { productId: 2, quantity: 1 },
                { productId: 11, quantity: 1 },
              ],
              customerName: user?.name || "Carlos Cliente",
              customerPhone: "+51 987 654 321",
              customerEmail: user?.email,
              delivery: {
                method: "delivery" as const,
                address: "Jr. Cusco 456, Miraflores",
                district: "Miraflores",
                reference: "Casa blanca con portón negro",
              },
              payment: {
                method: "whatsapp" as const,
              },
              total: 284.9,
              status: "pending" as const,
              date: "2024-12-08T09:00:00Z",
              estimatedDelivery: "2024-12-10T18:00:00Z",
              // Legacy fields
              customerAddress: "Jr. Cusco 456, Miraflores",
              deliveryMethod: "delivery" as const,
              location: "main-gym" as const,
            },
          ];
          setOrders(customerOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getOrderProducts = (order: Order) => {
    return order.items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "in-progress":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "yape":
        return "Yape/Plin";
      case "whatsapp":
        return "WhatsApp";
      default:
        return method;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground">
            Revisa el estado de tus pedidos y tu historial de compras
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aún no tienes pedidos
            </h3>
            <p className="text-muted-foreground mb-6">
              ¡Comienza a explorar nuestros productos y realiza tu primera
              compra!
            </p>
            <Link to="/shop">
              <Button className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ir a la Tienda
              </Button>
            </Link>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendiente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmado</TabsTrigger>
              <TabsTrigger value="in-progress">En Proceso</TabsTrigger>
              <TabsTrigger value="delivered">Entregado</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const orderProducts = getOrderProducts(order);
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              Pedido #{order.id}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(order.date), "dd MMM yyyy", {
                                  locale: es,
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                {order.delivery.method === "delivery" ? (
                                  <Truck className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                {order.delivery.method === "delivery"
                                  ? "Delivery"
                                  : "Recojo en tienda"}
                              </div>
                              <span>
                                Pago:{" "}
                                {getPaymentMethodText(order.payment.method)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={
                                order.status === "delivered"
                                  ? "bg-green-600 text-white"
                                  : order.status === "confirmed"
                                    ? "bg-blue-600 text-white"
                                    : order.status === "in-progress"
                                      ? "bg-purple-600 text-white"
                                      : ""
                              }
                            >
                              {getStatusText(order.status)}
                            </Badge>
                            <div className="text-lg font-bold text-fitness-yellow mt-1">
                              S/. {order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-3">
                          {orderProducts.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                            >
                              <img
                                src={item.product?.image || "/placeholder.svg"}
                                alt={item.product?.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.product?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.product?.brand} • Cantidad:{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  S/.{" "}
                                  {(
                                    (item.product?.price || 0) * item.quantity
                                  ).toFixed(2)}
                                </p>
                                {order.status === "delivered" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-1 text-xs"
                                  >
                                    <Star className="h-3 w-3 mr-1" />
                                    Calificar
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-muted/20 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            {order.delivery.method === "delivery" ? (
                              <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                            ) : (
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            )}
                            <div className="text-sm">
                              {order.delivery.method === "delivery" ? (
                                <div>
                                  <p className="font-medium">
                                    Entrega a domicilio
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.delivery.address}
                                  </p>
                                  {order.delivery.district && (
                                    <p className="text-muted-foreground">
                                      {order.delivery.district}
                                    </p>
                                  )}
                                  {order.delivery.reference && (
                                    <p className="text-muted-foreground text-xs">
                                      Ref: {order.delivery.reference}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium">
                                    Recojo en tienda
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.delivery.location === "main-gym"
                                      ? "Stylo Fitness - Sede Principal"
                                      : "Stylo Fitness - Sucursal Norte"}
                                  </p>
                                </div>
                              )}
                              {order.estimatedDelivery && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {order.delivery.method === "delivery"
                                    ? "Estimado de entrega: "
                                    : "Disponible para recojo: "}
                                  {format(
                                    new Date(order.estimatedDelivery),
                                    "dd MMM yyyy, HH:mm",
                                    { locale: es },
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {order.status === "pending" && (
                            <Button variant="outline" size="sm">
                              Cancelar Pedido
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Contactar Soporte
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
