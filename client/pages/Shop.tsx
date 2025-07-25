import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Zap, Flame, Dumbbell, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Product } from "@shared/types";
import { ProductsResponse } from "@shared/api";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    {
      id: "protein",
      name: "Proteínas",
      icon: Dumbbell,
      description: "Para crecimiento muscular",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "creatine",
      name: "Creatina",
      icon: Zap,
      description: "Aumenta tu fuerza",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "fat-burner",
      name: "Quemadores",
      icon: Flame,
      description: "Acelera tu metabolismo",
      gradient: "from-red-500 to-red-600",
    },
    {
      id: "vitamins",
      name: "Vitaminas",
      icon: Sparkles,
      description: "Salud y bienestar",
      gradient: "from-green-500 to-green-600",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          setProducts(data.products);
          setFilteredProducts(data.products);
        } else {
          // Fallback to imported mock data if API fails
          const { mockProducts } = await import("@shared/mockData");
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to imported mock data if fetch fails
        try {
          const { mockProducts } = await import("@shared/mockData");
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
        } catch (importError) {
          console.error("Error importing mock data:", importError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-fitness-yellow to-orange-500 bg-clip-text text-transparent">
            Tienda de Suplementos
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Descubre los mejores suplementos para maximizar tu rendimiento y
            alcanzar tus objetivos fitness
          </p>
        </div>

        {/* Category Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <Card
                  key={category.id}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2",
                    isSelected
                      ? "border-fitness-yellow shadow-lg scale-105"
                      : "border-border hover:border-fitness-yellow/50",
                  )}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id,
                    )
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={cn(
                        "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-300",
                        category.gradient,
                        "group-hover:scale-110",
                      )}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-fitness-yellow transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-4">
                      <Badge
                        variant={isSelected ? "default" : "outline"}
                        className={
                          isSelected
                            ? "bg-fitness-yellow text-fitness-black"
                            : ""
                        }
                      >
                        {
                          filteredProducts.filter(
                            (p) => p.category === category.id,
                          ).length
                        }{" "}
                        productos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar productos, marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 focus:border-fitness-yellow"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "h-12 px-6 transition-all duration-300",
                selectedCategory === null
                  ? "bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
                  : "hover:border-fitness-yellow hover:text-fitness-yellow",
              )}
            >
              Todos los productos
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {isLoading
              ? "Cargando productos..."
              : `${filteredProducts.length} productos encontrados`}
          </p>
          {(searchTerm || selectedCategory) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              className="text-fitness-yellow"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-yellow mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg p-4 animate-pulse"
                >
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-muted h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {products.length === 0 ? "📦" : "🔍"}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {products.length === 0
                ? "No hay productos disponibles"
                : "No se encontraron productos"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {products.length === 0
                ? "Los productos se están cargando. Por favor, intenta nuevamente."
                : "Intenta cambiar los filtros o buscar con otros términos."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                if (products.length === 0) {
                  window.location.reload();
                }
              }}
              className="bg-fitness-yellow text-fitness-black"
            >
              {products.length === 0
                ? "Recargar página"
                : "Ver todos los productos"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* Featured badges for results */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-fitness-yellow text-fitness-black">
                {filteredProducts.filter((p) => p.featured).length} Destacados
              </Badge>
              <Badge variant="secondary">
                {filteredProducts.filter((p) => p.bestSeller).length} Más
                vendidos
              </Badge>
              <Badge variant="outline">
                {filteredProducts.filter((p) => p.stock < 10).length} Stock
                limitado
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
