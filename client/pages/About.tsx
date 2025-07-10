import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Clock,
  Award,
  Target,
  Heart,
  Users,
  Dumbbell,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sobre{" "}
            <span className="text-fitness-yellow">Stylo Fitness Store</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Más de 10 años dedicados a ayudarte a alcanzar tus metas fitness con
            los mejores suplementos del mercado y la asesoría más especializada.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-fitness-yellow" />
                Nuestra Misión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proporcionar suplementos nutricionales de la más alta calidad,
                acompañados de asesoría especializada, para ayudar a nuestros
                clientes a alcanzar sus objetivos de salud y rendimiento
                deportivo de manera segura y efectiva.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-fitness-yellow" />
                Nuestra Visión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser la tienda líder en suplementos deportivos en Perú,
                reconocida por la calidad de nuestros productos, la excelencia
                en el servicio al cliente y nuestro compromiso con el bienestar
                y desarrollo atlético de la comunidad fitness.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nuestra Historia
          </h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4">
                  Stylo Fitness Store Supplement nació en 2014 con una visión
                  clara: democratizar el acceso a suplementos nutricionales de
                  alta calidad para todos los atletas y entusiastas del fitness
                  en Lima y todo Perú.
                </p>
                <p className="text-muted-foreground mb-4">
                  Comenzamos como una pequeña tienda especializada, con un
                  equipo apasionado por el deporte y la nutrición. Hoy, después
                  de más de una década, nos hemos consolidado como una de las
                  marcas más confiables del sector.
                </p>
                <p className="text-muted-foreground">
                  Nuestro crecimiento se basa en la confianza de miles de
                  clientes que han alcanzado sus metas con nuestros productos y
                  asesoría personalizada.
                </p>
              </div>
              <div className="bg-muted/20 rounded-lg p-6 text-center">
                <Dumbbell className="h-16 w-16 text-fitness-yellow mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  +10 años
                </h3>
                <p className="text-muted-foreground">
                  de experiencia en el mercado fitness peruano
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-fitness-yellow" />
                  Calidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Solo trabajamos con las marcas más reconocidas y productos
                  certificados que cumplen con los más altos estándares de
                  calidad internacional.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-fitness-yellow" />
                  Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Brindamos asesoría personalizada y un servicio al cliente
                  excepcional, porque entendemos que cada persona tiene
                  objetivos únicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-fitness-yellow" />
                  Confianza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Construimos relaciones duraderas basadas en la transparencia,
                  honestidad y resultados comprobados de nuestros clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nuestras Ubicaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Store */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-fitness-yellow" />
                  Sede Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Stylo Fitness - Centro de Lima
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Av. Revolución 1234, Col. Centro, Lima
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +51 1 234-5678
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Lunes a Viernes: 6:00 AM - 10:00 PM
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Sábados: 7:00 AM - 8:00 PM
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Nuestra sede principal con el inventario más completo y área
                  de consulta nutricional.
                </p>
              </CardContent>
            </Card>

            {/* Branch Store */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-fitness-yellow" />
                  Sucursal Norte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Stylo Fitness - Lima Norte
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Blvd. Norte 567, Col. Moderna, Lima Norte
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +51 1 876-5432
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Lunes a Viernes: 6:00 AM - 9:00 PM
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Sábados: 8:00 AM - 7:00 PM
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sucursal norte con atención personalizada y productos
                  especializados para crossfit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-fitness-yellow/10 border border-fitness-yellow/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ¿Listo para comenzar tu transformación?
          </h2>
          <p className="text-muted-foreground mb-6">
            Visítanos en cualquiera de nuestras ubicaciones o explora nuestro
            catálogo online para encontrar los suplementos perfectos para tus
            objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 h-10 px-6"
            >
              Explorar Productos
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
