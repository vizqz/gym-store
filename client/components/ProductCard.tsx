import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product.id, 1);
    toast({
      title: "¡Producto agregado!",
      description: `${product.name} se agregó a tu carrito`,
      duration: 2000,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating)
            ? "fill-fitness-yellow text-fitness-yellow"
            : "text-muted-foreground",
        )}
      />
    ));
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-fitness-yellow/50 overflow-hidden hover:shadow-fitness-yellow/20 bg-gradient-to-br from-card to-card/80",
        className,
      )}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/80">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.featured && (
              <Badge className="bg-fitness-yellow text-fitness-black text-xs">
                Destacado
              </Badge>
            )}
            {product.bestSeller && (
              <Badge variant="destructive" className="text-xs">
                Más vendido
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {product.stock} en stock
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {product.brand}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-fitness-yellow transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              ({product.rating})
            </span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-fitness-yellow">
                S/. {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">PEN</span>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-4 w-4 mr-1 group-hover:animate-pulse" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
