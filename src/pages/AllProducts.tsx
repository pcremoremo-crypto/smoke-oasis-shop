import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import type { ShopifyProduct } from "@/stores/cartStore";

// This is the same adapter from CollectionsSection.tsx
// In a real app, this would be in a shared utility file.
interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

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
      handle: localProduct.id,
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

export default function AllProducts() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query) return products;
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerCaseQuery) ||
      p.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, products]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">
              Todos Nuestros{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">Productos</span>
            </h1>
            <p className="text-xl text-muted-foreground">Explora nuestro catálogo completo.</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={adaptLocalProductToShopifyProduct(product)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {query ? `No se encontraron productos para "${query}".` : "No hay productos disponibles."}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}