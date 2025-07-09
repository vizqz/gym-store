import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/types";
import { ProductsResponse } from "@shared/api";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getCartTotal } =
    useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleRemoveItem = (productId: number, productName: string) => {
    removeItem(productId);
    toast({
      title: "Producto eliminado",
      description: `${productName} se eliminó de tu carrito`,
      variant: "destructive",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos fueron eliminados",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const subtotal = getCartTotal(products);
  const deliveryFee = deliveryMethod === "delivery" ? 15.0 : 0;
  const total = subtotal + deliveryFee;

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              ¡Descubre nuestros productos y comienza a construir tu rutina
              perfecta!
            </p>
            <Link to="/shop">
              <Button className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 text-lg px-8 py-3">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ir a la Tienda
              </Button>
            </Link>
          </div>

          {/* Featured Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-sm mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.brand}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-fitness-yellow">
                        S/. {product.price.toFixed(2)}
                      </span>
                      <Link to="/shop">
                        <Button
                          size="sm"
                          className="bg-fitness-yellow text-fitness-black"
                        >
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Seguir comprando
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Carrito de Compras
            </h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "producto" : "productos"} en
              tu carrito
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.product!.image}
                      alt={item.product!.name}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {item.product!.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product!.brand}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {item.product!.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveItem(item.productId, item.product!.name)
                          }
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            S/. {item.product!.price.toFixed(2)} c/u
                          </p>
                          <p className="text-lg font-bold text-fitness-yellow">
                            S/.{" "}
                            {(item.product!.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>S/. {subtotal.toFixed(2)}</span>
                  </div>

                  {/* Delivery Method */}
                  <div className="space-y-3">
                    <Label>Método de entrega:</Label>
                    <RadioGroup
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label
                          htmlFor="delivery"
                          className="flex-1 cursor-pointer"
                        >
                          Delivery (S/. 15.00)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label
                          htmlFor="pickup"
                          className="flex-1 cursor-pointer"
                        >
                          Recojo en tienda (Gratis)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío:</span>
                    <span>S/. {deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-fitness-yellow">
                    S/. {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => setShowCheckout(!showCheckout)}
                  className="w-full bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 text-lg py-3"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceder al Pago
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full"
                >
                  Vaciar carrito
                </Button>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            {showCheckout && (
              <Card>
                <CardHeader>
                  <CardTitle>Datos de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Ingresa tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+51 987 654 321" />
                  </div>
                  {deliveryMethod === "delivery" && (
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        placeholder="Av. Lima 123, San Isidro"
                      />
                    </div>
                  )}
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Confirmar Pedido
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
