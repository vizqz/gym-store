import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Truck,
  CreditCard,
  Smartphone,
  Building2,
  Phone,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  QrCode,
  Copy,
  Check,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper } from "@/components/ui/stepper";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { DeliveryInfo, PaymentInfo, GymLocation, Product } from "@shared/types";
import { ProductsResponse } from "@shared/api";

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
    title: "Procesar",
    description: "Procesar pago",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Confirmar",
    description: "Revisar pedido",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

interface PaymentMethod {
  id: "card" | "yape" | "bank";
  name: string;
  description: string;
  icon: any;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
  },
  {
    id: "yape",
    name: "Yape / Plin",
    description: "Pago mediante código QR",
    icon: QrCode,
  },
  {
    id: "bank",
    name: "Transferencia Bancaria",
    description: "Depósito o transferencia directa",
    icon: Building2,
  },
];

export default function Checkout() {
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    method: "delivery",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod["id"]>("card");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    bankConfirmed: false,
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
  });

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
  }, [items.length, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para continuar con la compra",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [user, navigate, toast]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          setProducts(data.products);
        } else {
          const { mockProducts } = await import("@shared/mockData");
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        try {
          const { mockProducts } = await import("@shared/mockData");
          setProducts(mockProducts);
        } catch (importError) {
          console.error("Error importing mock data:", importError);
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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

    if (currentStep === 2) {
      // Validate customer info
      if (!customerInfo.name || !customerInfo.phone) {
        toast({
          title: "Datos incompletos",
          description: "Por favor completa tu nombre y teléfono",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentProcess = async () => {
    setIsLoading(true);

    try {
      // Validate payment based on method
      if (selectedPaymentMethod === "card") {
        if (
          !paymentData.cardNumber ||
          !paymentData.expiryDate ||
          !paymentData.cvv ||
          !paymentData.cardholderName
        ) {
          toast({
            title: "Datos de tarjeta incompletos",
            description: "Por favor completa todos los datos de la tarjeta",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      if (selectedPaymentMethod === "bank" && !paymentData.bankConfirmed) {
        toast({
          title: "Confirma la transferencia",
          description: "Por favor confirma que has realizado la transferencia",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "¡Pago procesado!",
        description: "Tu pago ha sido procesado exitosamente",
      });

      setCurrentStep(4); // Move to final confirmation step
    } catch (error) {
      toast({
        title: "Error en el pago",
        description:
          "Hubo un problema al procesar el pago. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderComplete = (orderData: any) => {
    clearCart();
    toast({
      title: "¡Pedido completado!",
      description: "Tu orden ha sido procesada exitosamente",
      duration: 3000,
    });
    navigate("/order-confirmation", { state: { orderData } });
  };

  const handleCompleteOrder = async () => {
    setIsLoading(true);

    try {
      // Create order
      const orderData = {
        customerId: user?.id || 0,
        items,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        delivery,
        payment: { method: selectedPaymentMethod },
        total: finalTotal,
        status: "confirmed",
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      handleOrderComplete(orderData);
    } catch (error) {
      toast({
        title: "Error al confirmar pedido",
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

  if (isLoadingProducts) {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/cart")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Carrito
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Finalizar Compra
              </h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? "producto" : "productos"}{" "}
                en tu carrito
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-fitness-yellow">
              S/. {finalTotal.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total a pagar</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-fitness-yellow" />
                  Método de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-muted/20 rounded-lg">
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
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {delivery.method === "pickup" && (
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Selecciona la tienda *
                    </Label>
                    <RadioGroup
                      value={delivery.location || ""}
                      onValueChange={(value: "main-gym" | "branch-gym") =>
                        setDelivery((prev) => ({ ...prev, location: value }))
                      }
                    >
                      <div className="grid grid-cols-1 gap-4">
                        {gymLocations.map((location) => (
                          <div
                            key={location.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={location.id}
                              id={location.id}
                            />
                            <Card className="flex-1">
                              <CardContent className="p-4">
                                <Label
                                  htmlFor={location.id}
                                  className="cursor-pointer block"
                                >
                                  <h4 className="font-medium text-base mb-2">
                                    {location.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {location.address}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Phone className="h-4 w-4" />
                                    {location.phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {location.hours}
                                  </div>
                                </Label>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-fitness-yellow" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-fitness-yellow" />
                    Seleccionar Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={(value: PaymentMethod["id"]) =>
                      setSelectedPaymentMethod(value)
                    }
                  >
                    <div className="space-y-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <div
                            key={method.id}
                            className="flex items-center space-x-2 p-4 border rounded-lg"
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label
                              htmlFor={method.id}
                              className="flex items-center gap-3 cursor-pointer flex-1"
                            >
                              <Icon className="h-5 w-5" />
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {method.description}
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {/* Payment Form Based on Selected Method */}
                  {selectedPaymentMethod === "card" && (
                    <div className="mt-6 p-6 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-4">Datos de la Tarjeta</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">
                            Número de tarjeta *
                          </Label>
                          <Input
                            id="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                cardNumber: e.target.value,
                              }))
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">
                            Fecha de vencimiento *
                          </Label>
                          <Input
                            id="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                expiryDate: e.target.value,
                              }))
                            }
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={paymentData.cvv}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                cvv: e.target.value,
                              }))
                            }
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardholderName">
                            Nombre del titular *
                          </Label>
                          <Input
                            id="cardholderName"
                            value={paymentData.cardholderName}
                            onChange={(e) =>
                              setPaymentData((prev) => ({
                                ...prev,
                                cardholderName: e.target.value,
                              }))
                            }
                            placeholder="Como aparece en la tarjeta"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "yape" && (
                    <div className="mt-6 p-6 bg-muted/20 rounded-lg text-center">
                      <h4 className="font-medium mb-4">Pago con Yape/Plin</h4>
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        {/* Simulated QR Code */}
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border rounded">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Escanea el código QR con tu app de Yape o Plin
                      </p>
                      <p className="text-lg font-bold text-fitness-yellow">
                        Monto: S/. {finalTotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Después de pagar, presiona "Confirmar Pago"
                      </p>
                    </div>
                  )}

                  {selectedPaymentMethod === "bank" && (
                    <div className="mt-6 p-6 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-4">
                        Transferencia Bancaria
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Banco:</span>
                          <span>BCP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Cuenta Corriente:</span>
                          <span>194-123456789-0-12</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "194-123456789-0-12",
                              );
                              toast({
                                title: "Copiado",
                                description: "Número de cuenta copiado",
                              });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">CCI:</span>
                          <span>002-194-001234567890-12</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "002-194-001234567890-12",
                              );
                              toast({
                                title: "Copiado",
                                description: "CCI copiado",
                              });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Titular:</span>
                          <span>Stylo Fitness SAC</span>
                        </div>
                        <div className="flex justify-between font-bold text-fitness-yellow">
                          <span>Monto a transferir:</span>
                          <span>S/. {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox
                          id="bankConfirmed"
                          checked={paymentData.bankConfirmed}
                          onCheckedChange={(checked) =>
                            setPaymentData((prev) => ({
                              ...prev,
                              bankConfirmed: checked as boolean,
                            }))
                          }
                        />
                        <Label htmlFor="bankConfirmed" className="text-sm">
                          Confirmo que he realizado la transferencia
                        </Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Process Payment Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handlePaymentProcess}
                  disabled={isLoading}
                  size="lg"
                  className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fitness-black mr-2"></div>
                      Procesando Pago...
                    </>
                  ) : selectedPaymentMethod === "card" ? (
                    "Pagar Ahora"
                  ) : selectedPaymentMethod === "yape" ? (
                    "Confirmar Pago"
                  ) : (
                    "Confirmar Transferencia"
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumen Final del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Success Message */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">
                      ¡Pago procesado exitosamente!
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Tu pago ha sido confirmado y procesado correctamente.
                  </p>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  <h4 className="font-medium">Productos</h4>
                  <div className="space-y-3">
                    {cartProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg"
                      >
                        <img
                          src={item.product!.image}
                          alt={item.product!.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product!.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.product!.brand}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            S/. {item.product!.price.toFixed(2)} c/u
                          </p>
                          <p className="text-lg font-bold text-fitness-yellow">
                            S/.{" "}
                            {(item.product!.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Entrega
                  </h4>
                  {delivery.method === "delivery" ? (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">
                        Entrega a domicilio
                      </p>
                      <p>
                        {delivery.address}, {delivery.district}
                      </p>
                      {delivery.reference && <p>Ref: {delivery.reference}</p>}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">
                        Recojo en tienda
                      </p>
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
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pago
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaymentMethod === "card" &&
                      "Tarjeta de Crédito/Débito"}
                    {selectedPaymentMethod === "yape" && "Yape / Plin"}
                    {selectedPaymentMethod === "bank" &&
                      "Transferencia Bancaria"}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Pago confirmado
                  </p>
                </div>

                {/* Total */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span>S/. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>
                      {delivery.method === "delivery" ? "Delivery:" : "Recojo:"}
                    </span>
                    <span>S/. {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total Pagado:</span>
                    <span className="text-fitness-yellow">
                      S/. {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || currentStep === 4}
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : currentStep === 4 ? (
              <Button
                onClick={handleCompleteOrder}
                disabled={isLoading}
                size="lg"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                {isLoading ? (
                  "Finalizando..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Pedido
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
