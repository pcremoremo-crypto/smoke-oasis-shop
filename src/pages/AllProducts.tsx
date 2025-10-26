import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { mockCollections as allCollections } from "@/lib/mock-data";
import type { ShopifyProduct } from "@/stores/cartStore";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AllProducts() {
  useSmoothScroll();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId) 
        : [...prev, collectionId]
    );
  };

  const searchResults = useMemo(() => {
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    const allProducts = allCollections.flatMap(c => c.node.products.edges);
    return allProducts.filter(p => 
      p.node.title.toLowerCase().includes(lowerCaseQuery) ||
      p.node.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query]);

  const filteredCollections = selectedCollections.length > 0
    ? allCollections.filter(c => selectedCollections.includes(c.node.id))
    : allCollections;

  const renderContent = () => {
    if (query) {
      return (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Resultados de búsqueda para "{query}"</h2>
            <Link to="/productos">
              <Button variant="outline">Limpiar búsqueda</Button>
            </Link>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product: ShopifyProduct) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No se encontraron productos para "{query}".</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="mb-12 p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Filtrar por Colección</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {allCollections.map(collection => (
              <div key={collection.node.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={collection.node.id}
                  checked={selectedCollections.includes(collection.node.id)}
                  onCheckedChange={() => handleCollectionChange(collection.node.id)}
                />
                <Label htmlFor={collection.node.id} className="text-base cursor-pointer">
                  {collection.node.title}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-20">
          {filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => {
              const products = collection.node.products.edges;
              if (products.length === 0) return null;
              return (
                <div id={collection.node.handle} key={collection.node.id} className="animate-fade-in">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-foreground">{collection.node.title}</h2>
                    {collection.node.description && <p className="text-muted-foreground text-lg">{collection.node.description}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: ShopifyProduct) => (
                      <ProductCard key={product.node.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Por favor, selecciona al menos una colección para ver los productos.</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          {!query && (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold mb-4">
                Todos Nuestros{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">Productos</span>
              </h1>
              <p className="text-xl text-muted-foreground">Explora todas nuestras colecciones en un solo lugar.</p>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
}
