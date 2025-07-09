import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/types";
import { ProductsResponse } from "@shared/api";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: "protein", name: "Proteínas", icon: "💪" },
    { id: "creatine", name: "Creatina", icon: "⚡" },
    { id: "fat-burner", name: "Quemadores", icon: "🔥" },
    { id: "vitamins", name: "Vitaminas", icon: "🌟" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tienda de Suplementos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encuentra los mejores suplementos para tu entrenamiento en Stylo
            Fitness Store.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos, marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null
                  ? "bg-fitness-yellow text-fitness-black"
                  : ""
              }
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id,
                  )
                }
                className={
                  selectedCategory === category.id
                    ? "bg-fitness-yellow text-fitness-black"
                    : ""
                }
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-4 animate-pulse"
              >
                <div className="bg-muted h-48 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground mb-4">
              Intenta cambiar los filtros o buscar con otros términos.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              className="bg-fitness-yellow text-fitness-black"
            >
              Ver todos los productos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
