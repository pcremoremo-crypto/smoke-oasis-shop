import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = node.priceRange.minVariantPrice.currencyCode;
  const image = node.images.edges[0]?.node.url;
  const defaultVariant = node.variants.edges[0]?.node;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!defaultVariant) return;

    const cartItem = {
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success("Añadido al carrito", {
      description: `${node.title} ha sido añadido a tu carrito`,
    });
  };

  return (
    <Dialog>
      <Card className="group overflow-hidden border-border hover:shadow-card hover:border-primary/50 transition-all duration-300 h-full bg-card flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link to={`/product/${node.handle}`} className="cursor-pointer">
            {image && (
              <img
                src={image}
                alt={node.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Button
              size="sm"
              variant="secondary"
              className="shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Añadir
            </Button>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="shadow-lg bg-background/95"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            </DialogTrigger>
          </div>
        </div>

        <CardContent className="p-4 space-y-2 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link to={`/product/${node.handle}`}>{node.title}</Link>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.description || "Sin descripción disponible"}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">{currency}</span>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-[700px]">
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="md:col-span-1">
            <img
              src={image}
              alt={node.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="md:col-span-1 flex flex-col h-full">
            <DialogHeader>
              <DialogTitle className="text-2xl">{node.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-base text-muted-foreground mt-2 line-clamp-4 flex-grow">
              {node.description}
            </DialogDescription>
            <div className="mt-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currency}
                </span>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => handleAddToCart()}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Añadir al carrito
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
