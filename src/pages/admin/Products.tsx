import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useProductsStore } from "@/stores/adminProductsStore";

// Zod schema for client-side validation
const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  price: z.coerce.number().positive("El precio debe ser un número positivo."),
  stock: z.coerce.number().int().nonnegative("El stock no puede ser negativo."),
  image: z.any().optional(),
});

export const Products = () => {
  const {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    isDialogOpen,
    setIsDialogOpen,
    currentProduct,
    setCurrentProduct,
  } = useProductsStore();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isDialogOpen) {
      if (currentProduct) {
        form.reset({
          name: currentProduct.name,
          description: currentProduct.description,
          price: Number(currentProduct.price),
          stock: Number(currentProduct.stock),
        });
      } else {
        form.reset({ name: '', description: '', price: 0, stock: 0 });
      }
    }
  }, [isDialogOpen, currentProduct, form]);

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', String(values.price));
    formData.append('stock', String(values.stock));

    const imageFile = values.image?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (currentProduct) {
      await updateProduct(currentProduct.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  const handleOpenDialog = (product: any = null) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => handleOpenDialog()}>Añadir Producto</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Editar Producto' : 'Añadir Producto'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        {...fieldProps} 
                        value={undefined} // Required for file inputs
                        onChange={(event) => onChange(event.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentProduct?.image && <img src={currentProduct.image} alt={currentProduct.name} className="w-20 h-20 object-cover rounded-md"/>}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id}>
            {product.image && <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg"/>}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <p className="font-bold mt-4">${(product.price ? parseFloat(product.price as any) : 0).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => handleOpenDialog(product)}>Editar</Button>
                <Button variant="destructive" onClick={() => deleteProduct(product.id)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
