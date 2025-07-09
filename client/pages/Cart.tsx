import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Carrito de Compras
        </h1>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-muted-foreground mb-6">
            Agrega productos increíbles para empezar tu compra
          </p>
          <Button className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90">
            Ir a la Tienda
          </Button>
        </div>
      </div>
    </div>
  );
}
