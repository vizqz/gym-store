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
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { DeliveryInfo, PaymentInfo, GymLocation, Product } from "@shared/types";

interface CheckoutStepperProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
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

const steps = [
  {
    title: "Entrega",
    description: "Método de entrega",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    title: "Pago",
    description: "Método de pago",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Confirmar",
    description: "Revisar pedido",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

export function CheckoutStepper({
  products,
  isOpen,
  onClose,
  onOrderComplete,
}: CheckoutStepperProps) {
  const { user } = useAuth();
  const { items, getCartTotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
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

  const subtotal = getCartTotal(products);
  const deliveryFee = delivery.method === "delivery" ? 15.0 : 0;
  const finalTotal = subtotal + deliveryFee;

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate delivery step
      if (
        delivery.method === "delivery" &&
        (!delivery.address || !delivery.district)
      ) {
        toast({
          title: "Dirección incompleta",
          description: "Por favor completa la dirección de entrega",
          variant: "destructive",
        });
        return;
      }
      if (delivery.method === "pickup" && !delivery.location) {
        toast({
          title: "Selecciona una tienda",
          description: "Por favor selecciona dónde recoger tu pedido",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
Subtotal: S/. ${subtotal.toFixed(2)}
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
    onClose();
  };

  const handleCompleteOrder = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa tu nombre y teléfono",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onOrderComplete(orderData);
      onClose();
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

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Finalizar Compra
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          {currentStep === 1 && (
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
                    setDelivery({ method: value })
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
                          setDelivery((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
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
                          setDelivery((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
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
                          setDelivery((prev) => ({
                            ...prev,
                            reference: e.target.value,
                          }))
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
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      {gymLocations.map((location) => (
                        <Card
                          key={location.id}
                          className={`cursor-pointer transition-all ${
                            delivery.location === location.id
                              ? "border-fitness-yellow bg-fitness-yellow/5"
                              : "hover:border-fitness-yellow/50"
                          }`}
                          onClick={() =>
                            setDelivery((prev) => ({
                              ...prev,
                              location: location.id,
                            }))
                          }
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
          )}

          {currentStep === 2 && (
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

                {/* Customer Info */}
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Información de Contacto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
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
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email (opcional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Order Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products */}
                  <div className="space-y-3">
                    {cartProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                      >
                        <img
                          src={item.product!.image}
                          alt={item.product!.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.product!.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.product!.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {item.quantity} x S/.{" "}
                            {item.product!.price.toFixed(2)}
                          </p>
                          <p className="text-sm font-bold text-fitness-yellow">
                            S/.{" "}
                            {(item.product!.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Entrega
                    </h4>
                    {delivery.method === "delivery" ? (
                      <div className="text-sm text-muted-foreground">
                        <p>Entrega a domicilio</p>
                        <p>
                          {delivery.address}, {delivery.district}
                        </p>
                        {delivery.reference && <p>Ref: {delivery.reference}</p>}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <p>Recojo en tienda</p>
                        <p>
                          {
                            gymLocations.find(
                              (loc) => loc.id === delivery.location,
                            )?.name
                          }
                        </p>
                        <p>
                          {
                            gymLocations.find(
                              (loc) => loc.id === delivery.location,
                            )?.address
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pago
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {payment.method === "cash" && "Pago en efectivo"}
                      {payment.method === "yape" && "Yape / Plin"}
                      {payment.method === "whatsapp" &&
                        "Coordinación por WhatsApp"}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>S/. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {delivery.method === "delivery"
                          ? "Delivery:"
                          : "Recojo:"}
                      </span>
                      <span>S/. {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-fitness-yellow">
                        S/. {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCompleteOrder}
                disabled={isLoading}
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                {isLoading ? (
                  "Procesando..."
                ) : payment.method === "whatsapp" ? (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar por WhatsApp
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Pedido
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
