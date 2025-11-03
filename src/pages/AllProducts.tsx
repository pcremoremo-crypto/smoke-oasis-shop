import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import type { ShopifyProduct } from "@/stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const ProductSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[250px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default function AllProducts() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // This should match the backend limit

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}&q=${query}`);
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        // Ensure current page is valid if total products change
        if (currentPage > data.totalPages && data.totalPages > 0) {
          setCurrentPage(data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, query]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuery = (e.target as HTMLFormElement).elements.namedItem("search")?.value;
    setSearchParams(newQuery ? { q: newQuery } : {});
    setCurrentPage(1); // Reset to first page on new search
  };

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

          <form onSubmit={handleSearchSubmit} className="mb-8 flex justify-center">
            <input 
              type="search" 
              name="search" 
              placeholder="Buscar productos..." 
              defaultValue={query}
              className="w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="ml-2">Buscar</Button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: productsPerPage }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={adaptLocalProductToShopifyProduct(product)} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">
                  {query ? `No se encontraron productos para "${query}".` : "No hay productos disponibles."}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <span className="text-lg font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
