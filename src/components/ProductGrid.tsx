import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";
import type { ShopifyProduct } from "@/stores/cartStore";

export const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts(20);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-4">No hay productos disponibles</h3>
        <p className="text-muted-foreground">
          Crea productos escribiendo en el chat. Por ejemplo: "Crea un producto de hookah premium por $150"
        </p>
      </div>
    );
  }

  return (
    <section id="productos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Nuestros <span className="bg-gradient-accent bg-clip-text text-transparent">Productos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Explora nuestra selección premium de hookahs y accesorios
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
