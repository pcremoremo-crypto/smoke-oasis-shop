import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Contáctanos</h1>
          <p className="text-muted-foreground text-lg">
            ¿Tienes alguna pregunta o comentario? Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
          <form className="space-y-4">
            <Input type="text" placeholder="Nombre" />
            <Input type="email" placeholder="Email" />
            <Textarea placeholder="Tu mensaje" rows={5} />
            <Button type="submit" size="lg">Enviar Mensaje</Button>
          </form>
        </div>
        <div className="space-y-6 rounded-lg bg-muted/40 p-8">
          <h2 className="text-3xl font-bold">Nuestras Redes</h2>
          <p className="text-muted-foreground">
            Síguenos en nuestras redes sociales para estar al día de las últimas novedades y ofertas.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaTwitter size={28} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook size={28} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={28} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
