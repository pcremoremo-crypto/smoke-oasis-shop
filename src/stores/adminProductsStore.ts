import { create } from 'zustand';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductState {
  products: Product[];
  isDialogOpen: boolean;
  currentProduct: Product | null;
  fetchProducts: () => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setIsDialogOpen: (isOpen: boolean) => void;
  setCurrentProduct: (product: Product | null) => void;
}

export const useProductsStore = create<ProductState>((set, get) => ({
  products: [],
  isDialogOpen: false,
  currentProduct: null,

  setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  setCurrentProduct: (product) => set({ currentProduct: product }),

  fetchProducts: async () => {
    try {
      const response = await fetch('/api/products?limit=100'); // Fetch more for admin view
      const data = await response.json();
      set({ products: data.products });
    } catch (error) {
      toast.error('Error al cargar los productos');
    }
  },

  addProduct: async (formData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create product');
      const newProduct = await response.json();
      set((state) => ({ products: [...state.products, newProduct] }));
      toast.success('Producto creado con éxito');
      set({ isDialogOpen: false });
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  },

  updateProduct: async (id, formData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
      }));
      toast.success('Producto actualizado con éxito');
      set({ isDialogOpen: false, currentProduct: null });
    } catch (error) {
      toast.error('Error al actualizar el producto');
    }
  },

  deleteProduct: async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      toast.success('Producto eliminado con éxito');
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  },
}));
