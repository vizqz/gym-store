import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  MapPin,
  Truck,
  Calendar,
  Phone,
  MessageCircle,
  ArrowLeft,
  Home,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const data = location.state?.orderData;
    if (!data) {
      // If no order data, redirect to cart
      navigate("/cart");
      return;
    }
    setOrderData(data);
  }, [location.state, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-yellow mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const estimatedDelivery = addDays(new Date(), 2);
  const isPickup = orderData.delivery.method === "pickup";
  const isWhatsAppOrder = orderData.payment.method === "whatsapp";

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

  const handleWhatsAppContinue = () => {
    if (orderData.whatsappMessage) {
      const phoneNumber = "51987654321";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderData.whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isWhatsAppOrder ? "¡Pedido Preparado!" : "¡Pedido Confirmado!"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isWhatsAppOrder
              ? "Tu mensaje de WhatsApp está listo para enviar"
              : "Tu pedido ha sido recibido y está siendo procesado"}
          </p>
        </div>

        {/* WhatsApp Action */}
        {isWhatsAppOrder && (
          <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Finaliza tu pedido en WhatsApp
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                Haz clic en el botón para enviar tu pedido directamente por
                WhatsApp y coordinar el pago y entrega
              </p>
              <Button
                onClick={handleWhatsAppContinue}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Continuar en WhatsApp
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-fitness-yellow" />
                  Detalles del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderData.items.map((item: any) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          Producto #{item.productId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      S/.{" "}
                      {(
                        orderData.total -
                        (orderData.delivery.method === "delivery" ? 15 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isPickup ? "Recojo:" : "Delivery:"}
                    </span>
                    <span>S/. {isPickup ? "0.00" : "15.00"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-fitness-yellow">
                      S/. {orderData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-fitness-yellow" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>{" "}
                  {orderData.customerInfo.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>{" "}
                  {orderData.customerInfo.phone}
                </div>
                {orderData.customerInfo.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {orderData.customerInfo.email}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Delivery & Payment Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isPickup ? (
                    <MapPin className="h-5 w-5 text-fitness-yellow" />
                  ) : (
                    <Truck className="h-5 w-5 text-fitness-yellow" />
                  )}
                  {isPickup
                    ? "Información de Recojo"
                    : "Información de Entrega"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPickup ? (
                  <div>
                    <h4 className="font-medium mb-2">
                      {orderData.delivery.location === "main-gym"
                        ? "Stylo Fitness - Sede Principal"
                        : "Stylo Fitness - Sucursal Norte"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {orderData.delivery.location === "main-gym"
                        ? "Av. Revolución 1234, Col. Centro, Lima"
                        : "Blvd. Norte 567, Col. Moderna, Lima Norte"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Teléfono:{" "}
                      {orderData.delivery.location === "main-gym"
                        ? "+51 1 234-5678"
                        : "+51 1 876-5432"}
                    </p>
                    <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Disponible para recojo:{" "}
                          {format(estimatedDelivery, "dd 'de' MMMM, yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium mb-2">Dirección de entrega</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{orderData.delivery.address}</p>
                      <p>{orderData.delivery.district}</p>
                      {orderData.delivery.reference && (
                        <p className="text-xs">
                          Ref: {orderData.delivery.reference}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Entrega estimada:{" "}
                          {format(estimatedDelivery, "dd 'de' MMMM, yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {orderData.payment.method === "cash" && (
                    <Home className="h-4 w-4 text-muted-foreground" />
                  )}
                  {orderData.payment.method === "yape" && (
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  )}
                  {orderData.payment.method === "whatsapp" && (
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{getPaymentMethodText(orderData.payment.method)}</span>
                </div>
                {orderData.payment.method === "yape" && (
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Te contactaremos pronto con los datos para realizar la
                      transferencia
                    </p>
                  </div>
                )}
                {orderData.payment.method === "cash" && (
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {isPickup
                        ? "Pago al momento del recojo en tienda"
                        : "Pago contra entrega"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/my-orders">
              <Package className="h-4 w-4 mr-2" />
              Ver Mis Pedidos
            </Link>
          </Button>
          <Button asChild className="bg-fitness-yellow text-fitness-black">
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Seguir Comprando
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Si tienes alguna pregunta sobre tu pedido, no dudes en
              contactarnos
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                +51 1 234-5678
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
