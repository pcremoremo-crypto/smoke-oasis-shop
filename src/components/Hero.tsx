import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { mockCollections } from "@/lib/mock-data";
import heroImage from "@/assets/hero-hookah.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('colecciones');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredCollection = mockCollections?.[0]?.node;
  const backgroundImage = featuredCollection?.image?.url || heroImage;
  const title = featuredCollection?.title || "Eleva tu experiencia de Hookah";
  const description = featuredCollection?.description || "Descubre nuestra colección premium de narguiles y accesorios. Calidad superior, diseños únicos.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="text-sm font-semibold tracking-wider text-secondary uppercase px-4 py-2 bg-secondary/10 rounded-full border border-secondary/30">
              Premium Hookah Experience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-accent hover:opacity-90 transition-all hover:shadow-glow group"
              onClick={scrollToProducts}
            >
              Explorar Colecciones
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/productos">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
