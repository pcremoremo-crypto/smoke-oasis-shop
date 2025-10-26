import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { mockProducts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

// Definimos un tipo más estricto para el nodo del producto
type ProductNode = ShopifyProduct['node'];

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const productNode = mockProducts.find(p => p.node.handle === handle)?.node as ProductNode | undefined;

  const [product, setProduct] = useState<ProductNode | null>(productNode || null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (product) {
      const initialVariant = product.variants?.edges?.[0]?.node;
      setSelectedVariant(initialVariant);
      setDisplayedImage(initialVariant?.image?.url || product.images.edges[0]?.node.url || null);
    }
  }, [product]);

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setDisplayedImage(variant.image.url);
    }
  };

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
      description: `${product.title} (${selectedVariant.title}) ha sido añadido a tu carrito`,
    });
  };

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
        <Footer />
      </>
    );
  }

  const price = parseFloat(selectedVariant?.price?.amount || '0');
  const currency = selectedVariant?.price?.currencyCode || 'USD';

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/productos" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-card mb-4">
                {displayedImage && (
                  <img
                    src={displayedImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images.edges.map((imageEdge, index) => (
                  <button 
                    key={index} 
                    onClick={() => setDisplayedImage(imageEdge.node.url)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      displayedImage === imageEdge.node.url ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground/50"
                    )}
                  >
                    <img src={imageEdge.node.url} alt={imageEdge.node.altText || `Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                {selectedVariant && <p className="text-lg text-muted-foreground">{selectedVariant.title}</p>}
                <p className="text-3xl font-bold text-primary mt-4">
                  ${price.toFixed(2)} {currency}
                </p>
              </div>

              {product.description && (
                <div className="prose prose-lg">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {product.options.map(option => (
                <div key={option.name} className="space-y-3">
                  <label className="text-sm font-semibold">{option.name}:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((variantEdge: any) => (
                      <Button
                        key={variantEdge.node.id}
                        variant={selectedVariant?.id === variantEdge.node.id ? "default" : "outline"}
                        onClick={() => handleVariantSelect(variantEdge.node)}
                        className={selectedVariant?.id === variantEdge.node.id ? "bg-gradient-accent" : ""}
                      >
                        {variantEdge.node.title}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

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