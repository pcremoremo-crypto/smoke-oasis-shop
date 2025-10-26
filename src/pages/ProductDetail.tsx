import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      try {
        const productData = await getProductByHandle(handle);
        setProduct(productData);
        setSelectedVariant(productData?.variants?.edges?.[0]?.node);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success('Añadido al carrito', {
      description: `${product.title} ha sido añadido a tu carrito`,
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Producto no encontrado</h2>
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </>
    );
  }

  const price = parseFloat(selectedVariant?.price?.amount || '0');
  const currency = selectedVariant?.price?.currencyCode || 'USD';
  const image = product.images?.edges?.[0]?.node?.url;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la tienda
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
              {image && (
                <img
                  src={image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                <p className="text-3xl font-bold text-primary">
                  ${price.toFixed(2)} {currency}
                </p>
              </div>

              {product.description && (
                <div className="prose prose-lg">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {product.variants?.edges?.length > 1 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Variante:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((variant: any) => (
                      <Button
                        key={variant.node.id}
                        variant={selectedVariant?.id === variant.node.id ? "default" : "outline"}
                        onClick={() => setSelectedVariant(variant.node)}
                        className={selectedVariant?.id === variant.node.id ? "bg-gradient-accent" : ""}
                      >
                        {variant.node.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full bg-gradient-accent hover:opacity-90 transition-all text-lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {selectedVariant?.availableForSale ? 'Añadir al Carrito' : 'No Disponible'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
