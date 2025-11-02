import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import type { ShopifyProduct } from "@/stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";

// A simplified product type for our local data
interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

// Adapter function to convert local product data to the ShopifyProduct format expected by ProductCard
const adaptLocalProductToShopifyProduct = (localProduct: LocalProduct): ShopifyProduct => {
  const variantNode = {
    id: `variant-${localProduct.id}`,
    title: 'Default Title',
    price: {
      amount: localProduct.price,
      currencyCode: 'USD',
    },
    image: {
      url: localProduct.image,
      altText: localProduct.name,
    },
    availableForSale: localProduct.stock > 0,
    selectedOptions: [],
  };

  return {
    node: {
      id: localProduct.id,
      title: localProduct.name,
      description: localProduct.description,
      handle: localProduct.id, // Use id as handle for simplicity
      priceRange: {
        minVariantPrice: {
          amount: localProduct.price,
          currencyCode: 'USD',
        },
      },
      images: {
        edges: [
          {
            node: {
              url: localProduct.image,
              altText: localProduct.name,
            },
          },
        ],
      },
      variants: {
        edges: [
          { node: variantNode },
        ],
      },
      options: [],
    },
  };
};

const ProductSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[250px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export const CollectionsSection = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Explora Nuestros{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Productos
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            La mejor selección para tu sesión de hookah
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={adaptLocalProductToShopifyProduct(product)} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-2xl font-semibold mb-4">No hay productos disponibles</h3>
              <p className="text-muted-foreground">
                Los productos se mostrarán aquí. Añade nuevos productos desde el panel de administración.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
