import { Navigation } from "@/components/Navigation";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Contacto</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Sede Principal
            </h2>
            <p className="text-muted-foreground">
              Av. Revolución 1234, Col. Centro, Ciudad
              <br />
              Teléfono: +52 55 1234-5678
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Sucursal Norte
            </h2>
            <p className="text-muted-foreground">
              Blvd. Norte 567, Col. Moderna, Ciudad
              <br />
              Teléfono: +52 55 8765-4321
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-8">
          Página en construcción... Próximamente con mapa interactivo y
          formulario de contacto.
        </p>
      </div>
    </div>
  );
}
