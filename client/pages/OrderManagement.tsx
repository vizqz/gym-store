import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  CheckCircle,
  Clock,
  Package,
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Order, Product } from "@shared/types";
import { OrderResponse, ProductsResponse } from "@shared/api";
import { useAuth } from "@/hooks/useAuth";

interface StepperProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-fitness-yellow text-fitness-black"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    index < currentStep ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderManagement() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stockChecked, setStockChecked] = useState<Record<number, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      title: "Revisar Orden",
      description: "Verificar información del pedido",
    },
    {
      title: "Verificar Stock",
      description: "Confirmar disponibilidad de productos",
    },
    {
      title: "Actualizar Estado",
      description: "Cambiar estado de la orden",
    },
    {
      title: "Confirmación",
      description: "Revisar y finalizar",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;

      try {
        const [orderRes, productsRes] = await Promise.all([
          fetch(`/api/orders/${orderId}`),
          fetch("/api/products"),
        ]);

        if (orderRes.ok) {
          const orderData: OrderResponse = await orderRes.json();
          setOrder(orderData.order);
        }

        if (productsRes.ok) {
          const productsData: ProductsResponse = await productsRes.json();
          setProducts(productsData.products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const orderProducts = order?.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const handleStockCheck = (productId: number) => {
    setStockChecked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const allStockChecked = orderProducts?.every(
    (item) => stockChecked[item.productId],
  );

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

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus as any });
        setCurrentStep(3); // Move to confirmation step
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    navigate("/worker");
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Orden no encontrada
            </h1>
            <Button onClick={() => navigate("/worker")}>
              Volver al Panel de Empleado
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/worker")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestión de Orden #{order.id}
              </h1>
              <p className="text-muted-foreground">
                Cliente: {order.customerName}
              </p>
            </div>
          </div>
          <Badge
            variant={
              order.status === "pending"
                ? "destructive"
                : order.status === "delivered"
                  ? "outline"
                  : "secondary"
            }
            className="text-sm"
          >
            {getStatusText(order.status)}
          </Badge>
        </div>

        {/* Stepper */}
        <Card className="mb-6">
          <CardContent>
            <Stepper currentStep={currentStep} steps={steps} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 0: Order Review */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-fitness-yellow" />
                    Información de la Orden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Información del Cliente
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Nombre:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {order.customerPhone}
                      </p>
                      {order.customerEmail && (
                        <p>
                          <strong>Email:</strong> {order.customerEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Información de Entrega
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Método:</strong>{" "}
                        {order.delivery.method === "delivery"
                          ? "Delivery"
                          : "Recojo en tienda"}
                      </p>
                      {order.delivery.method === "delivery" && (
                        <>
                          <p>
                            <strong>Dirección:</strong> {order.delivery.address}
                          </p>
                          <p>
                            <strong>Distrito:</strong> {order.delivery.district}
                          </p>
                          {order.delivery.reference && (
                            <p>
                              <strong>Referencia:</strong>{" "}
                              {order.delivery.reference}
                            </p>
                          )}
                        </>
                      )}
                      {order.delivery.method === "pickup" && (
                        <p>
                          <strong>Sucursal:</strong>{" "}
                          {order.delivery.location === "main-gym"
                            ? "Principal"
                            : "Sucursal Norte"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Información de Pago
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p>
                        <strong>Método:</strong> {order.payment.method}
                      </p>
                      <p>
                        <strong>Total:</strong> S/. {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Stock Verification */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-fitness-yellow" />
                    Verificación de Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Stock Disponible</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderProducts?.map((item) => {
                        const isAvailable =
                          item.product && item.product.stock >= item.quantity;
                        const isChecked = stockChecked[item.productId];
                        return (
                          <TableRow key={item.productId}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {item.product?.name ||
                                    "Producto no encontrado"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.product?.brand}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  isAvailable ? "default" : "destructive"
                                }
                              >
                                {item.product?.stock || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={isChecked ? "default" : "outline"}
                                onClick={() => handleStockCheck(item.productId)}
                                disabled={!isAvailable}
                                className={
                                  isChecked
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }
                              >
                                {isAvailable ? (
                                  isChecked ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verificado
                                    </>
                                  ) : (
                                    "Verificar"
                                  )
                                ) : (
                                  <>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Sin Stock
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Update Status */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-fitness-yellow" />
                    Actualizar Estado de la Orden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="mb-2">
                      <strong>Estado actual:</strong>{" "}
                      <Badge variant="secondary">
                        {getStatusText(order.status)}
                      </Badge>
                    </p>
                    <p className="mb-4 text-muted-foreground">
                      ¿Estás seguro de que quieres actualizar el estado de esta
                      orden?
                    </p>

                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(getNextStatus(order.status)!)
                        }
                        disabled={isProcessing}
                        className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fitness-black mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {getNextStatus(order.status) === "in-progress"
                          ? "Marcar En Proceso"
                          : "Marcar como Entregado"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Orden Procesada Exitosamente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-green-800 mb-2">
                      La orden #{order.id} ha sido actualizada exitosamente.
                    </p>
                    <p className="text-green-600 text-sm">
                      <strong>Nuevo estado:</strong>{" "}
                      {getStatusText(order.status)}
                    </p>
                    <p className="text-green-600 text-sm">
                      <strong>Procesado por:</strong> {user?.name}
                    </p>
                    <p className="text-green-600 text-sm">
                      <strong>Fecha:</strong>{" "}
                      {new Date().toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <Button
                    onClick={handleFinish}
                    className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                  >
                    Volver al Panel de Empleado
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderProducts?.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product?.name || "Producto no encontrado"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        S/.{" "}
                        {((item.product?.price || 0) * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>S/. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  {currentStep < 2 && (
                    <Button
                      onClick={handleNext}
                      disabled={currentStep === 1 && !allStockChecked}
                      className="flex-1 bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button
                      onClick={handleFinish}
                      className="flex-1 bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                    >
                      Finalizar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
