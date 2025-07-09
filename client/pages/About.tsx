import { Navigation } from "@/components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Sobre Stylo Fitness
        </h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Más de 10 años dedicados a ayudarte a alcanzar tus metas fitness con
            los mejores suplementos del mercado.
          </p>
          <p className="text-muted-foreground">
            Página en construcción... Próximamente con información completa
            sobre nuestras ubicaciones y servicios.
          </p>
        </div>
      </div>
    </div>
  );
}
