import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Smoke Oasis
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/#productos" className="text-foreground hover:text-primary transition-colors">
              Productos
            </Link>
            <CartDrawer />
          </div>
        </div>
      </div>
    </nav>
  );
};
