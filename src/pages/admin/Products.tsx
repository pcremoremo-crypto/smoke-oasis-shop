import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());

    const url = currentProduct ? `/api/products/${currentProduct.id}` : '/api/products';
    const method = currentProduct ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then(res => res.json())
      .then(updatedProduct => {
        if (currentProduct) {
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        } else {
          setProducts([...products, updatedProduct]);
        }
        setIsDialogOpen(false);
        setCurrentProduct(null);
      });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => { setCurrentProduct(null); setIsDialogOpen(true); }}>Añadir Producto</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Editar Producto' : 'Añadir Producto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <Input name="name" placeholder="Nombre del producto" defaultValue={currentProduct?.name || ''} />
            <Textarea name="description" placeholder="Descripción" defaultValue={currentProduct?.description || ''} />
            <Input name="price" type="number" placeholder="Precio" defaultValue={currentProduct?.price || ''} />
            <Input name="stock" type="number" placeholder="Stock" defaultValue={currentProduct?.stock || ''} />
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <p className="font-bold mt-4">${product.price}</p>
              <p>Stock: {product.stock}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => handleEdit(product)}>Editar</Button>
                <Button variant="destructive" onClick={() => handleDelete(product.id)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
