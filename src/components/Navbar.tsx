import { useState } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/productos?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link to="/" className="hidden sm:flex items-center gap-2 group">
              <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Smoke Oasis
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center px-4">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/productos" className="hidden md:block text-foreground hover:text-primary transition-colors">
              Productos
            </Link>
            <CartDrawer />
          </div>
        </div>
      </div>
    </nav>
  );
};