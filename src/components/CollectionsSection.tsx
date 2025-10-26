import { useEffect, useState } from "react";
import { getCollections } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";
import type { ShopifyProduct } from "@/stores/cartStore";

interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    products: {
      edges: ShopifyProduct[];
    };
  };
}

export const CollectionsSection = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getCollections(10);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-4">No hay colecciones disponibles</h3>
        <p className="text-muted-foreground">
          Las colecciones se mostrarán aquí cuando agregues productos a categorías en tu tienda Shopify.
        </p>
      </div>
    );
  }

  return (
    <section id="colecciones" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Explora Nuestras{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Colecciones
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Descubre productos organizados por categoría
          </p>
        </div>

        <div className="space-y-20">
          {collections.map((collection) => {
            const products = collection.node.products.edges;
            
            if (products.length === 0) return null;

            return (
              <div
                key={collection.node.id}
                className="animate-fade-in"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2 text-foreground">
                    {collection.node.title}
                  </h3>
                  {collection.node.description && (
                    <p className="text-muted-foreground text-lg">
                      {collection.node.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 9).map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
