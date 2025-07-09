import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Truck,
  CreditCard,
  Smartphone,
  MessageCircle,
  Phone,
  Home,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { DeliveryInfo, PaymentInfo, GymLocation, Product } from "@shared/types";

interface CheckoutFormProps {
  products: Product[];
  total: number;
  onOrderComplete: (orderData: any) => void;
}

const gymLocations: GymLocation[] = [
  {
    id: "main-gym",
    name: "Stylo Fitness - Sede Principal",
    address: "Av. Revolución 1234, Col. Centro, Lima",
    phone: "+51 1 234-5678",
    hours: "Lunes a Viernes: 6:00 AM - 10:00 PM | Sábados: 7:00 AM - 8:00 PM",
    description: "Nuestra sede principal con el inventario más completo",
  },
  {
    id: "branch-gym",
    name: "Stylo Fitness - Sucursal Norte",
    address: "Blvd. Norte 567, Col. Moderna, Lima Norte",
    phone: "+51 1 876-5432",
    hours: "Lunes a Viernes: 6:00 AM - 9:00 PM | Sábados: 8:00 AM - 7:00 PM",
    description: "Sucursal norte con atención personalizada",
  },
];

export function CheckoutForm({
  products,
  total,
  onOrderComplete,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    method: "delivery",
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "cash",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
  });

  const deliveryFee = delivery.method === "delivery" ? 15.0 : 0;
  const finalTotal = total + deliveryFee;

  const handleDeliveryMethodChange = (method: "pickup" | "delivery") => {
    setDelivery({ method });
  };

  const handleLocationChange = (location: "main-gym" | "branch-gym") => {
    setDelivery((prev) => ({ ...prev, location }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return `• ${product?.name} x${item.quantity} - S/. ${((product?.price || 0) * item.quantity).toFixed(2)}`;
      })
      .join("\n");

    const deliveryInfo =
      delivery.method === "delivery"
        ? `🏠 *Entrega a domicilio*\nDirección: ${delivery.address}\nDistrito: ${delivery.district}\nReferencia: ${delivery.reference || "Sin referencia"}`
        : `🏪 *Recojo en tienda*\nUbicación: ${gymLocations.find((loc) => loc.id === delivery.location)?.name}\nDirección: ${gymLocations.find((loc) => loc.id === delivery.location)?.address}`;

    return `🏋️‍♂️ *PEDIDO STYLO FITNESS* 🏋️‍♂️

👤 *Cliente:* ${customerInfo.name}
📞 *Teléfono:* ${customerInfo.phone}
📧 *Email:* ${customerInfo.email}

📦 *Productos:*
${itemsList}

${deliveryInfo}

💰 *Resumen de pago:*
Subtotal: S/. ${total.toFixed(2)}
${delivery.method === "delivery" ? `Delivery: S/. ${deliveryFee.toFixed(2)}` : "Recojo: S/. 0.00"}
*TOTAL: S/. ${finalTotal.toFixed(2)}*

💳 *Método de pago:* ${payment.method === "cash" ? "Efectivo" : payment.method === "yape" ? "Yape/Plin" : "WhatsApp"}

¡Gracias por tu pedido! Te contactaremos pronto para confirmar. 💪`;
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "51987654321"; // Gym's WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Mark order as completed
    const orderData = {
      items,
      customerInfo,
      delivery,
      payment,
      total: finalTotal,
      whatsappMessage: message,
    };
    onOrderComplete(orderData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa tu nombre y teléfono",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (
      delivery.method === "delivery" &&
      (!delivery.address || !delivery.district)
    ) {
      toast({
        title: "Dirección incompleta",
        description: "Por favor completa la dirección de entrega",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (delivery.method === "pickup" && !delivery.location) {
      toast({
        title: "Selecciona una tienda",
        description: "Por favor selecciona dónde recoger tu pedido",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (payment.method === "whatsapp") {
        handleWhatsAppOrder();
        return;
      }

      // Create order
      const orderData = {
        customerId: user?.id || 0,
        items,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        delivery,
        payment,
        total: finalTotal,
        status: "pending",
        date: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        // Legacy fields for compatibility
        customerAddress:
          delivery.method === "delivery" ? delivery.address || "" : "",
        deliveryMethod: delivery.method,
        location: delivery.location || "main-gym",
      };

      // In a real app, this would be a POST request to create the order
      // For demo, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onOrderComplete(orderData);
    } catch (error) {
      toast({
        title: "Error al procesar pedido",
        description: "Hubo un problema. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-fitness-yellow" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="+51 987 654 321"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="tu@email.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-fitness-yellow" />
            Método de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={delivery.method}
            onValueChange={(value: "pickup" | "delivery") =>
              handleDeliveryMethodChange(value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label
                htmlFor="delivery"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Truck className="h-4 w-4" />
                Entrega a domicilio (+S/. 15.00)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label
                htmlFor="pickup"
                className="flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                Recojo en tienda (Gratis)
              </Label>
            </div>
          </RadioGroup>

          {delivery.method === "delivery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-muted/20 rounded-lg">
              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={delivery.address || ""}
                  onChange={(e) =>
                    handleAddressChange("address", e.target.value)
                  }
                  placeholder="Av. Lima 123"
                  required
                />
              </div>
              <div>
                <Label htmlFor="district">Distrito *</Label>
                <Input
                  id="district"
                  value={delivery.district || ""}
                  onChange={(e) =>
                    handleAddressChange("district", e.target.value)
                  }
                  placeholder="San Isidro"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reference">Referencia</Label>
                <Textarea
                  id="reference"
                  value={delivery.reference || ""}
                  onChange={(e) =>
                    handleAddressChange("reference", e.target.value)
                  }
                  placeholder="Edificio verde, piso 5, departamento 502"
                  rows={2}
                />
              </div>
            </div>
          )}

          {delivery.method === "pickup" && (
            <div className="mt-4">
              <Label>Selecciona la tienda *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {gymLocations.map((location) => (
                  <Card
                    key={location.id}
                    className={`cursor-pointer transition-all ${
                      delivery.location === location.id
                        ? "border-fitness-yellow bg-fitness-yellow/5"
                        : "hover:border-fitness-yellow/50"
                    }`}
                    onClick={() => handleLocationChange(location.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <RadioGroupItem
                          value={location.id}
                          checked={delivery.location === location.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {location.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {location.address}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Phone className="h-3 w-3" />
                            {location.phone}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {location.hours}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-fitness-yellow" />
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={payment.method}
            onValueChange={(value: "cash" | "yape" | "whatsapp") =>
              setPayment({ method: value })
            }
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cash" id="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Home className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Pago en efectivo</div>
                    <div className="text-xs text-muted-foreground">
                      {delivery.method === "delivery"
                        ? "Contra entrega"
                        : "Al recoger en tienda"}
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="yape" id="yape" />
                <Label
                  htmlFor="yape"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Yape / Plin</div>
                    <div className="text-xs text-muted-foreground">
                      Te enviaremos los datos para transferir
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label
                  htmlFor="whatsapp"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">
                      Envía tu pedido por WhatsApp para coordinar
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>S/. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {delivery.method === "delivery" ? "Delivery:" : "Recojo:"}
            </span>
            <span>S/. {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-fitness-yellow">
              S/. {finalTotal.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 text-lg py-6"
      >
        {isLoading ? (
          "Procesando..."
        ) : payment.method === "whatsapp" ? (
          <>
            <MessageCircle className="h-5 w-5 mr-2" />
            Enviar por WhatsApp
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Confirmar Pedido
          </>
        )}
      </Button>
    </form>
  );
}
