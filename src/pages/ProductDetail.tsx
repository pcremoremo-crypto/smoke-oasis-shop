import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// We need a type for the local product data
interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid md:grid-cols-2 gap-12">
      <Skeleton className="w-full h-[450px] rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (!handle) return;
    setIsLoading(true);
    fetch(`/api/products/${handle}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch product:", err);
        setIsLoading(false);
      });
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;

    // We need to adapt the LocalProduct to the format the cart expects.
    // This is a simplified version.
    const cartItem = {
      product: {
        node: {
          id: product.id,
          title: product.name,
          description: product.description,
          handle: product.id,
          images: { edges: [{ node: { url: product.image, altText: product.name } }] },
          priceRange: { minVariantPrice: { amount: product.price, currencyCode: 'USD' } },
          variants: { edges: [{ node: { id: `variant-${product.id}`, title: 'Default', price: { amount: product.price, currencyCode: 'USD' } } }] }
        }
      },
      variantId: `variant-${product.id}`,
      quantity: 1,
      price: { amount: product.price, currencyCode: 'USD' },
    };

    addItem(cartItem as any);
    toast.success('Añadido al carrito', {
      description: `${product.name} ha sido añadido a tu carrito`,
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <ProductDetailSkeleton />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">Producto no encontrado</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <p className="text-4xl font-bold text-primary">${parseFloat(product.price).toFixed(2)}</p>
            <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </p>
            <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Añadir al carrito
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
