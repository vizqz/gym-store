import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Mail,
  Send,
  ExternalLink,
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "¡Mensaje enviado!",
      description:
        "Hemos recibido tu mensaje. Te contactaremos pronto. ¡Gracias!",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleWhatsAppContact = () => {
    const message = `Hola, me gustaría obtener más información sobre los productos y servicios de Stylo Fitness Store Supplement.

Nombre: ${formData.name || "[Tu nombre]"}
${formData.phone ? `Teléfono: ${formData.phone}` : ""}
${formData.message ? `Consulta: ${formData.message}` : ""}

¡Gracias!`;

    const phoneNumber = "51987654321";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Abriendo WhatsApp",
      description: "Se abrirá WhatsApp con tu consulta pre-escrita",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas sobre nuestros productos o necesitas asesoría
            personalizada? Estamos aquí para ayudarte a alcanzar tus objetivos
            fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-fitness-yellow" />
                  Envíanos un mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+51 987 654 321"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-fitness-yellow text-fitness-black hover:bg-fitness-yellow/90 flex-1"
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhatsAppContact}
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Store Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-fitness-yellow" />
                  Nuestras Ubicaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Store */}
                <div className="border-b border-border pb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    🏢 Sede Principal - Centro de Lima
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Av. Revolución 1234, Col. Centro, Lima
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      +51 1 234-5678
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Lun-Vie: 6:00 AM - 10:00 PM
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Sábados: 7:00 AM - 8:00 PM
                    </div>
                  </div>
                </div>

                {/* Branch Store */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    🏪 Sucursal Norte - Lima Norte
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Blvd. Norte 567, Col. Moderna, Lima Norte
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      +51 1 876-5432
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Lun-Vie: 6:00 AM - 9:00 PM
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Sábados: 8:00 AM - 7:00 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-fitness-yellow" />
                  Contacto Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-fitness-yellow" />
                    <div>
                      <p className="font-medium">Llámanos</p>
                      <p className="text-sm text-muted-foreground">
                        Atención inmediata
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="tel:+5112345678">Llamar</a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        Respuesta rápida
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/51987654321?text=${encodeURIComponent("Hola, me gustaría obtener información sobre los productos de Stylo Fitness Store Supplement.")}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-fitness-yellow" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        info@stylofitness.pe
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:info@stylofitness.pe">Escribir</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-fitness-yellow" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Lunes - Viernes
                    </span>
                    <span className="font-medium">6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sábados</span>
                    <span className="font-medium">7:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domingos</span>
                    <span className="font-medium">Cerrado</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Los horarios pueden variar en fechas especiales y feriados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center bg-fitness-yellow/10 border border-fitness-yellow/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            ¿Necesitas asesoría especializada?
          </h2>
          <p className="text-muted-foreground mb-4">
            Nuestros expertos en nutrición deportiva están disponibles para
            ayudarte a elegir los suplementos perfectos para tus objetivos.
          </p>
          <p className="text-sm text-muted-foreground">
            📍 Visítanos en cualquiera de nuestras sucursales o contáctanos por
            WhatsApp para una consulta personalizada gratuita.
          </p>
        </div>
      </div>
    </div>
  );
}
