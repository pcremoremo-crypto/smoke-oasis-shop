import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    const form = e.target;
    const formData = new FormData();

    formData.append('name', form.elements.name.value);
    formData.append('description', form.elements.description.value);
    formData.append('price', form.elements.price.value);
    formData.append('stock', form.elements.stock.value);
    
    const imageFile = form.elements.image.files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = currentProduct ? `/api/products/${currentProduct.id}` : '/api/products';
    const method = currentProduct ? 'PUT' : 'POST';

    fetch(url, {
      method,
      body: formData, // No headers needed, browser sets it for FormData
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) });
        }
        return res.json();
      })
      .then(updatedProduct => {
        if (currentProduct) {
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          toast.success('Producto actualizado', { description: `${updatedProduct.name} ha sido actualizado.` });
        } else {
          setProducts([...products, updatedProduct]);
          toast.success('Producto creado', { description: `${updatedProduct.name} ha sido añadido.` });
        }
        setIsDialogOpen(false);
        setCurrentProduct(null);
      })
      .catch(err => {
        console.error("Failed to save product:", err);
        toast.error('Error al guardar el producto', { description: err.message || 'Hubo un problema al guardar el producto.' });
      });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text) });
          }
          setProducts(products.filter(p => p.id !== id));
          toast.success('Producto eliminado', { description: 'El producto ha sido eliminado correctamente.' });
        })
        .catch(err => {
          console.error("Failed to delete product:", err);
          toast.error('Error al eliminar el producto', { description: err.message || 'Hubo un problema al eliminar el producto.' });
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
            <Input name="image" type="file" />
            {currentProduct?.image && <img src={currentProduct.image} alt={currentProduct.name} className="w-20 h-20 object-cover rounded-md"/>}
            <Button type="submit">Guardar</Button>
          </form>
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