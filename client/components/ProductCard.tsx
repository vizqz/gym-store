import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@shared/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
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
        "group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-fitness-yellow/30 overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
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
                ${product.price}
              </span>
              <span className="text-xs text-muted-foreground">MXN</span>
            </div>
            <Button
              size="sm"
              className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
