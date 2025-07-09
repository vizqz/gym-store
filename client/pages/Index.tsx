import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Trophy, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProducts, categories } from "@shared/mockData";

export default function Index() {
  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 3);
  const bestSellers = mockProducts.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-background to-fitness-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-fitness-yellow text-fitness-black mb-4">
                  ⚡ Nueva Colección 2024
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Supera tus{" "}
                  <span className="text-fitness-yellow">límites</span> con los
                  mejores suplementos
                </h1>
                <p className="text-lg text-muted-foreground mt-6 max-w-lg">
                  Descubre nuestra selección premium de suplementos deportivos.
                  Calidad garantizada para atletas de alto rendimiento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 font-semibold"
                  >
                    Explorar Tienda
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Ver Ofertas Especiales
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-fitness-yellow">
                    1000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Clientes Satisfechos
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-fitness-yellow">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Productos Premium
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-fitness-yellow">
                    10+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Años de Experiencia
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-fitness-yellow/20 to-fitness-black/20 rounded-3xl flex items-center justify-center border border-fitness-yellow/20">
                <div className="text-center">
                  <div className="text-8xl mb-4">💪</div>
                  <p className="text-lg font-semibold text-fitness-yellow">
                    Stylo Fitness Store
                  </p>
                  <p className="text-muted-foreground">
                    Tu tienda de confianza
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-fitness-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-fitness-yellow" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                100% Originales
              </h3>
              <p className="text-sm text-muted-foreground">
                Productos auténticos de las mejores marcas
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-fitness-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-fitness-yellow" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Envío Rápido
              </h3>
              <p className="text-sm text-muted-foreground">
                Entrega en 24-48 horas o recoge en nuestras sedes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-fitness-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-fitness-yellow" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Calidad Premium
              </h3>
              <p className="text-sm text-muted-foreground">
                Solo trabajamos con las marcas más reconocidas
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-fitness-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-fitness-yellow" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Asesoría Expert
              </h3>
              <p className="text-sm text-muted-foreground">
                Te ayudamos a elegir el suplemento perfecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Categorías Destacadas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encuentra exactamente lo que necesitas para tu rutina de
              entrenamiento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:border-fitness-yellow/50 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold text-foreground group-hover:text-fitness-yellow transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ver productos →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestra selección especial de los mejores suplementos del momento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Más Vendidos
              </h2>
              <p className="text-muted-foreground">
                Los favoritos de nuestros clientes
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fitness-yellow/10 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Listo para llevar tu entrenamiento al siguiente nivel?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de atletas que confían en Stylo Fitness para alcanzar
            sus objetivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90"
              >
                Comenzar Ahora
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contactar Asesor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-fitness-yellow rounded-full flex items-center justify-center">
                  <span className="text-fitness-black font-bold text-lg">
                    S
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-bold text-lg leading-none">
                    Stylo Fitness
                  </span>
                  <span className="text-fitness-yellow text-xs leading-none">
                    Store Supplement
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Tu tienda de confianza para suplementos deportivos de alta
                calidad.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Productos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Proteínas</li>
                <li>Creatina</li>
                <li>Quemadores</li>
                <li>Vitaminas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sobre Nosotros</li>
                <li>Contacto</li>
                <li>Ubicaciones</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Centro de Ayuda</li>
                <li>Envíos</li>
                <li>Devoluciones</li>
                <li>WhatsApp: +52 55 1234-5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Stylo Fitness Store Supplement. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
