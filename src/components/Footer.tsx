import { ShoppingBag } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Smoke Oasis
              </span>
            </div>
            <p className="text-muted-foreground">
              Tu destino premium para hookahs, narguiles y accesorios de alta calidad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/#productos" className="hover:text-primary transition-colors">
                  Productos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: info@smokeoasis.com</li>
              <li>Tel: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 Smoke Oasis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
